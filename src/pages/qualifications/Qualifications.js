import React from "react";
import Header from "../../components/Header/Header";
import styles from "./Qualifications.module.css";
import { useQualificationsContext } from "./QualificationsContext";
import { v4 as uuid } from "uuid";

const Qualifications = () => {
  const { survey, questionsLoading } = useQualificationsContext();
  return (
    <>
      <Header />

      {/* qualifications questions */}
      <div className={styles.qualifications_container}>
        <h1>Qualification Questions</h1>
        {questionsLoading ? (
          <span>Loading...</span>
        ) : (
          <div className={styles.questions_table_container}>
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Type</th>
                  <th className={styles.options_head}>Options</th>
                  <th className={styles.conditions_head}>Conditions Set</th>
                  <th>Quotas</th>
                </tr>
              </thead>
              <tbody>
                {survey?.qualifications?.questions?.map((que) => {
                  return (
                    <tr>
                      <td className={styles.que_text}>{que?.question_text}</td>
                      <td>{que?.question_type}</td>
                      <td className={styles.options}>
                        {que?.display_options?.map((optNo) => {
                          return (
                            <div key={uuid()} className={styles.option}>
                              <span>{que?.options?.[optNo]}</span>
                            </div>
                          );
                        })}
                      </td>
                      <td className={styles.conditions}>
                        <span className={styles.dark_text}>
                          One or more from:{" "}
                        </span>
                        {que?.conditions?.valid_responses?.map((validResp) => {
                          return (
                            <div key={uuid()} className={styles.condition}>
                              <span>
                                {validResp?.from} - {validResp?.to}
                              </span>
                            </div>
                          );
                        })}
                        {que?.conditions?.valid_options?.map((validOptNo) => {
                          return (
                            <div key={uuid()} className={styles.condition}>
                              <span>{que?.options[validOptNo]}</span>
                            </div>
                          );
                        })}
                      </td>
                      <td className={styles.quotas}>
                        {que?.conditions?.quotas &&
                          Object?.keys(que?.conditions?.quotas)?.map((key) => {
                            let optNo = que?.conditions?.valid_options?.[key];
                            return (
                              <div className={uuid()} className={styles.quota}>
                                <span>
                                  {que?.options?.[optNo]}:{" "}
                                  {que?.conditions?.quotas[key]}
                                </span>
                              </div>
                            );
                          })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Qualifications;
