import { createContext, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getAllSessions, getQuestion, getSurvey } from "../../firebaseQueries"

const analyticsContext = createContext()
export const useAanalyticsContext = () => {
	return useContext(analyticsContext)
}

const AnalyticsContextProvider = ({ children }) => {
	const { surveyID } = useParams()
	const [audienceData, setAudienceData] = useState({})
	const [suppliers, setSuppliers] = useState([])
	const [allSessions, setAllSessions] = useState([])
	const [survey, setSurvey] = useState({})
	const [sessionsDate, setSessionsDate] = useState({})
	const [graphData, setGraphData] = useState({})
	const [statusesCnt, setStatusesCnt] = useState({
		hits: 0,
		inClient: 0,
		completed: 0,
		terminated: 0,
		qualityTerminated: 0,
		quotaFull: 0,
	})

	const [lastPresentTime, setLastPresentTime] = useState("30")
	const [surveyLibraryQues, setSurveyLibraryQues] = useState([])
	useEffect(() => {
		getSurvey(surveyID).then(data => {
			setSurvey(data)
			data?.qualifications?.questions?.map(que => {
				getQuestion(que?.question_id).then(que => {
					setSurveyLibraryQues(prevArr => [...prevArr, que.data()])
				})
			})
		})
		getAllSessions(surveyID).then(sessions => {
			setAllSessions(sessions)
		})
	}, [surveyID])

	const handleGraphData = (creationDate, status) => {
		setGraphData(prevData => {
			return {
				...prevData,
				[creationDate]: {
					...prevData?.[creationDate],
					[status]:
						(prevData?.[creationDate]?.[status]
							? prevData?.[creationDate]?.[status]
							: 0) + 1,
				},
			}
		})
	}

	function handleAudienceData(varName, param) {
		varName[param] = (varName[param] ? varName[param] : 0) + 1
	}

	useEffect(() => {
		let usersByBrowsers = {},
			usersByDeviceTypes = {},
			usersByDeviceBrands = {},
			usersByOs = {},
			statusCnt = {}
		allSessions?.forEach(session => {
			let sd = session.data()
			let std = session.data()?.session_technical_details

			handleAudienceData(
				usersByBrowsers,
				std?.browser_name ? std?.browser_name : "others"
			)
			handleAudienceData(
				usersByDeviceTypes,
				std?.deviceType ? std?.deviceType : "others"
			)
			handleAudienceData(
				usersByDeviceBrands,
				std?.vendor ? std?.vendor : "others"
			)
			handleAudienceData(usersByOs, std?.os ? std?.os : "others")

			const options = {
				year: "numeric",
				month: "long",
				day: "numeric",
			}
			let creationDate = sd?.date
				.toDate()
				.toLocaleDateString("en-us", options)

			handleGraphData(creationDate, "hits")

			if (sd?.mirats_status === 3) {
				handleAudienceData(statusCnt, "inClient")
				handleGraphData(creationDate, "inClient")
			}
			switch (sd?.client_status) {
				case 10:
					handleAudienceData(statusCnt, "completed")
					handleGraphData(creationDate, "completed")
					break
				case 20:
					handleAudienceData(statusCnt, "terminated")
					handleGraphData(creationDate, "terminated")
					break
				case 30:
					handleAudienceData(statusCnt, "qualityTerminated")
					handleGraphData(creationDate, "qualityTerminated")
					break
				case 40:
					handleAudienceData(statusCnt, "quotaFull")
					handleGraphData(creationDate, "quotaFull")
					break
				default:
					return
			}
		})

		setStatusesCnt(statusCnt)
		setAudienceData({
			usersByBrowsers,
			usersByDeviceBrands,
			usersByDeviceTypes,
			usersByOs,
		})

		setStatusesCnt(prevData => {
			return {
				...prevData,
				hits: allSessions?.docs?.length,
			}
		})

		setSessionsDate({
			startDate: allSessions?.docs?.[0]?.data()?.date.toDate(),
			endDate: allSessions?.docs?.[allSessions?.docs?.length - 1]
				?.data()
				?.date.toDate(),
		})

		// for supplier by completes card
		getSurvey(surveyID).then(data => {
			setSuppliers([])
			data?.external_suppliers?.map(supp => {
				let completes = 0,
					completeTimeSum = 0
				allSessions?.forEach(session => {
					if (
						session.data()?.supplier_account_id ===
							supp?.supplier_account_id &&
						session?.data()?.client_status === 10
					) {
						completes++
						completeTimeSum += parseInt(
							session.data()?.total_survey_time.split(":")[1]
						)
					}
				})
				setSuppliers(prevData => {
					return [
						...prevData,
						{
							supplier: supp?.supplier_account,
							completes,
							avgCompleteTime: (completes
								? completeTimeSum / completes
								: 0
							).toFixed(0),
						},
					]
				})
			})
		})

		// for completes by employees card
		// allSessions?.docs?.map((session) => {
		//   session.data()?.responses?.map((res) => {
		//     if (res?.question_id === "22467") {
		//       console.log(res?.user_response);
		//       getQuestion("22467").then((res) => {
		//         console.log(res.data()?.lang?.[survey?.country?.code]?.options);
		//       });
		//     }
		//   });
		// });
	}, [allSessions])

	const getCompletesByQuestionResponse = (sessions, setState) => {
		setState({})
		sessions?.map(session => {
			session?.responses?.map((res, index) => {
				let key
				surveyLibraryQues?.map(que => {
					if (String(que?.question_id) === String(res?.question_id)) {
						// --->>  setting the key for future use (eg. {"18-40":}, {"male":}, {"mumbai":})
						if (que?.question_type === "Numeric - Open-end") {
							let userResp = parseInt(res?.user_response)
							let ageRange = []
							survey?.qualifications?.questions?.map(que => {
								if (
									String(que?.question_id) ===
									String(res?.question_id)
								) {
									que?.conditions?.valid_responses?.map(
										resp => {
											ageRange.push(
												`${resp?.from}-${resp?.to}`
											)
										}
									)
								}
							})
							ageRange?.forEach(range => {
								if (
									parseInt(range.split("-")[0]) <= userResp &&
									parseInt(range.split("-")[1]) >= userResp
								) {
									key = range
								}
							})
						} else {
							key =
								que?.lang?.[survey?.country?.code].options[
									res?.user_response
								]
						}
						// ---> setting the numerator and denominator value (eg. {"18-40": { numerator: 4, denominator: 10 }})
						if (key && que?.question_type !== "Multi Punch") {
							setState(prevData => {
								return {
									...prevData,
									[res?.question_name]: {
										...prevData?.[res?.question_name],
										[key]: {
											...prevData?.[res?.question_name]?.[
												key
											],
											denominator:
												(prevData?.[
													res?.question_name
												]?.[key]?.denominator
													? prevData?.[
															res?.question_name
													  ]?.[key]?.denominator
													: 0) + 1,
										},
									},
								}
							})

							if (session?.client_status === 10) {
								setState(prevData => {
									return {
										...prevData,
										[res?.question_name]: {
											...prevData?.[res?.question_name],
											[key]: {
												...prevData?.[
													res?.question_name
												]?.[key],
												numerator:
													(prevData?.[
														res?.question_name
													]?.[key]?.numerator
														? prevData?.[
																res
																	?.question_name
														  ]?.[key]?.numerator
														: 0) + 1,
											},
										},
									}
								})
							}
						}
					}
				})
			})
		})
	}

	const value = {
		audienceData,
		suppliers,
		allSessions,
		survey,
		statusesCnt,
		sessionsDate,
		graphData,
		lastPresentTime,
		setLastPresentTime,
		getCompletesByQuestionResponse,
		surveyLibraryQues,
	}
	return (
		<analyticsContext.Provider value={value}>
			{children}
		</analyticsContext.Provider>
	)
}

export default AnalyticsContextProvider
