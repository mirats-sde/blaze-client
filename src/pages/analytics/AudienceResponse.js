import React, { useEffect, useState } from "react";
import AnalyticsUserCountCard from "../../components/analyticsUserCountCard/AnalyticsUserCountCard";
import styles from "./Analytics.module.css";
import { useAanalyticsContext } from "./AnalyticsContext";
import AudienceResponse_BarChart from "./audience-response-bar-chart/AudienceResponse_BarChart";
import cardStyle from "../../components/analyticsUserCountCard/userAnalytcs.module.css";
import { v4 as uuid } from "uuid";
import { LinearProgress } from "@mui/material";
import { getQuestion } from "../../firebaseQueries";

const AudienceResponse = () => {
  const {
    allSessions,
    survey,
    getCompletesByQuestionResponse,
    surveyLibraryQues,
  } = useAanalyticsContext();

  const [usersByGender, setUsersByGender] = useState({
    Male: { numerator: 0, denominator: 0 },
    Female: { numerator: 0, denominator: 0 },
  });

  const [usersByQTBySupp, setUsersByQTBySupp] = useState({});
  const [usersByCountry, setUsersByCountry] = useState({});
  const [completesByQueResp, setCompletesByQueResp] = useState({});
  const [allSessionsData, setAllSessionsData] = useState([]);

  const handleUsersByGenderCard = (gender, forStatus) => {
    setUsersByGender((prevData) => {
      return {
        ...prevData,
        [gender]: {
          ...prevData?.[gender],
          [forStatus]: prevData?.[gender]?.[forStatus] + 1,
        },
      };
    });
  };

  useEffect(() => {
    setUsersByQTBySupp({});
    setUsersByCountry({});
    let allSessionsTmp = [];
    survey?.external_suppliers?.map((supp) => {
      allSessions?.forEach((session) => {
        const sd = session.data();
        const suppName = supp?.supplier_account;
        // condition for quality terminate by supplier
        if (supp?.supplier_account_id === sd?.supplier_account_id) {
          if (sd?.mirats_status === 3) {
            setUsersByQTBySupp((prevData) => {
              return {
                ...prevData,
                [suppName]: {
                  ...prevData?.[suppName],
                  denominator:
                    (prevData?.[suppName]?.denominator
                      ? prevData?.[suppName]?.denominator
                      : 0) + 1,
                },
              };
            });
          }
          if (sd?.client_status === 30) {
            setUsersByQTBySupp((prevData) => {
              return {
                ...prevData,
                [suppName]: {
                  ...prevData?.[suppName],
                  numerator:
                    (prevData?.[suppName]?.numerator
                      ? prevData?.[suppName]?.numerator
                      : 0) + 1,
                },
              };
            });
          }
        }
      });
    });
    allSessions?.forEach((session) => {
      const sd = session.data();
      allSessionsTmp.push(sd);
      let userResp;
      sd?.responses?.map((resp) => {
        if (resp?.question_id === "43") userResp = resp?.user_response;
      });

      //conditions for user by gender card
      if (userResp === 0) {
        if (sd?.mirats_status === 3) {
          handleUsersByGenderCard("Male", "denominator");
        }
        if (sd?.client_status === 10) {
          handleUsersByGenderCard("Male", "numerator");
        }
      } else if (userResp === 1) {
        if (sd?.mirats_status === 3) {
          handleUsersByGenderCard("Female", "denominator");
        }
        if (sd?.client_status === 10) {
          handleUsersByGenderCard("Female", "numerator");
        }
      }

      // conditions for user by country
      const country = sd?.geo_data?.country.toUpperCase();
      setUsersByCountry((prevData) => {
        return {
          ...prevData,
          [country]: (prevData?.[country] ? prevData?.[country] : 0) + 1,
        };
      });
      if (sd?.geo_data?.country_code) {
      }
    });
    // setAllSessionsData(allSessionsTmp)
    getCompletesByQuestionResponse(allSessionsTmp, setCompletesByQueResp);
  }, [allSessions, survey, surveyLibraryQues]);

  return (
    <>
      <div className={styles.audience_response_page}>
        <div className={styles.container1}>
          <div className={styles.left}>
            <div className={styles.audience_response_graph}>
              <AudienceResponse_BarChart />
            </div>
          </div>
          <div className={styles.right}>
            {/* users by country card  */}
            <div className={styles.users_by_country_card}>
              <div className={cardStyle.UserAnalytics_container}>
                <div className={cardStyle.legend}>
                  <span className={cardStyle.cardTitle}>users by country</span>
                </div>
                <div className={cardStyle.UserAnalytics_header}>
                  <h4>country</h4>
                  <h4>user base</h4>
                </div>
                {Object.keys(usersByCountry).map((key) => {
                  return (
                    <div key={uuid()}>
                      <div className={cardStyle.platform_type}>
                        <span>{key}</span>
                        <span>
                          {(usersByCountry[key] * 100) /
                            allSessions.docs.length}{" "}
                          %
                        </span>
                      </div>

                      <LinearProgress
                        color="inherit"
                        variant="determinate"
                        value={
                          ((usersByCountry[key] ? usersByCountry[key] : 0) *
                            100) /
                          allSessions.docs.length
                        }
                        // value={item.progress}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.container2}>
          {Object.keys(completesByQueResp).map((key) => {
            return (
              <div className={styles.audience_response_card} key={uuid()}>
                <AudienceResponseCard
                  cardTitle={`complets by ${key}`}
                  cardSubtitle={[key, "completes"]}
                  data={completesByQueResp[key]}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AudienceResponse;

export const AudienceResponseCard = ({ data, cardTitle, cardSubtitle }) => {
  return (
    <div className={cardStyle.UserAnalytics_container}>
      <div className={cardStyle.legend}>
        <span className={cardStyle.cardTitle}>{cardTitle}</span>
      </div>
      <div className={cardStyle.UserAnalytics_header}>
        <h4>{cardSubtitle[0]}</h4>
        <h4>{cardSubtitle[1]}</h4>
      </div>
      {Object.keys(data).map((key) => {
        return (
          <div key={uuid()}>
            <div className={cardStyle.platform_type}>
              <span>{key}</span>
              <span>
                {data[key]?.numerator ? data[key]?.numerator : 0} /{" "}
                {data[key]?.denominator}
              </span>
            </div>

            <LinearProgress
              color="inherit"
              variant="determinate"
              value={
                ((data[key]?.numerator ? data[key]?.numerator : 0) /
                  data[key]?.denominator) *
                100
              }
              // value={item.progress}
            />
          </div>
        );
      })}
    </div>
  );
};
