import { createContext, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getSurvey } from "../../firebaseQueries"

const SecurityContext = createContext()

export const useSecurityContext = () => {
	return useContext(SecurityContext)
}

const SecuirtyContextProvider = ({ children }) => {
	const { surveyID } = useParams()

	const [survey, setSurvey] = useState({})
	const [securities, setSecurities] = useState({})
	useEffect(() => {
		getSurvey(surveyID).then(res => {
			setSurvey(res)
			setSecurities(res?.security_checks)
		})
	}, [surveyID])
	const value = { securities, survey }
	return (
		<SecurityContext.Provider value={value}>
			{children}
		</SecurityContext.Provider>
	)
}

export default SecuirtyContextProvider
