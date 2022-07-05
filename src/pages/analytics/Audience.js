import React from "react"
import styles from "./Analytics.module.css"
import AnalyticsUserCountCard from "../../components/analyticsUserCountCard/AnalyticsUserCountCard"
import { AudienceGraph1, AudiencesGraph2 } from "./AudienceGraphs"
import { useAanalyticsContext } from "./AnalyticsContext"
import { v4 as uuid } from "uuid"

const Audience = () => {
	const { audienceData, statusesCnt, suppliers } = useAanalyticsContext()
	return (
		<div className={styles.audience_page}>
			<div className={styles.container1}>
				<div className={styles.left}>
					<AudienceGraph1 statusesCnt={statusesCnt} />
					<AudiencesGraph2 statusesCnt={statusesCnt} />
				</div>
				<div className={styles.right}>
					<AnalyticsUserCountCard
						cardTitle='Users by OS, with version'
						cardSubtitle={["os with version", "users"]}
						data={audienceData?.usersByOs}
						inClientSessions={statusesCnt?.hits}
					/>
					<AnalyticsUserCountCard
						cardTitle='Users by device types'
						cardSubtitle={["device types", "users"]}
						data={audienceData?.usersByDeviceTypes}
						inClientSessions={statusesCnt?.hits}
					/>
					<AnalyticsUserCountCard
						cardTitle='Users by device brands'
						cardSubtitle={["device types", "users"]}
						data={audienceData?.usersByDeviceBrands}
						inClientSessions={statusesCnt?.hits}
					/>
				</div>
			</div>

			<div className={styles.container2}>
				{/* users by browsers card */}
				<div className={styles.users_by_browsers_card}>
					<AnalyticsUserCountCard
						cardTitle='Users by Browsers'
						cardSubtitle={["Browsers", "users"]}
						data={audienceData?.usersByBrowsers}
						inClientSessions={statusesCnt?.hits}
					/>
				</div>
			</div>
		</div>
	)
}

export default Audience

