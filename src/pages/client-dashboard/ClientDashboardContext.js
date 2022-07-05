import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import {
  getAllSessions,
  getErrorCodesForClientStatus,
  getErrorCodesForMiratsStatus,
  getMiratsInsightsTeam,
} from "../../firebaseQueries";
const ClientDashbaordContext = createContext();

export const useClientDashboardContext = () => {
  return useContext(ClientDashbaordContext);
};

const ClientDashboardContextProvider = ({ children }) => {
  const { surveyID } = useParams();
  const [survey, setSurvey] = useState({});
  const [logs, setLogs] = useState({});
  const [statDetails, setStatDetails] = useState({});
  const [teams, setTeams] = useState({});
  const [codes, setCodes] = useState({});
  const [batti, setBatti] = useState(0);

  const getAvgCpi = (completedSessionsData) => {
    let sum = 0;
    completedSessionsData?.forEach((session) => {
      sum += parseFloat(session?.client_cpi);
    });
    if (!sum) return 0;
    return (sum / completedSessionsData?.length).toFixed(2);
  };

  const handleActiveLight = (mainStatus, internalStatus) => {
    console.log("Active light function");
    if (mainStatus?.toLowerCase() === "bidding") {
      setBatti(1);
    } else if (mainStatus?.toLowerCase() === "awarded") {
      setBatti(2);
    } else if (mainStatus?.toLowerCase() === "live") {
      if (internalStatus.toLowerCase() === "soft launch") setBatti(3);
      else if (internalStatus.toLowerCase() === "full launch") setBatti(4);
    } else if (mainStatus?.toLowerCase() === "complete") {
      setBatti(5);
    } else if (mainStatus?.toLowerCase() === "billed") {
      setBatti(6);
    } else {
      setBatti();
    }
  };

  useEffect(() => {
    getMiratsInsightsTeam().then((res) => {
      setTeams(res);
    });

    getErrorCodesForClientStatus().then((res) => {
      let codesTmp = [];
      res.forEach((code) => {
        codesTmp.push(code.data());
      });

      setCodes((prevData) => {
        return {
          ...prevData,
          client_codes: codesTmp,
        };
      });
    });
    getErrorCodesForMiratsStatus().then((res) => {
      let codesTmp = [];
      res.forEach((code) => {
        codesTmp.push(code.data());
      });

      setCodes((prevData) => {
        return {
          ...prevData,
          mirats_codes: codesTmp,
        };
      });
    });
  }, []);

  useEffect(() => {
    onSnapshot(
      doc(db, "miratsinsights", "blaze", "surveys", String(surveyID)),
      (res) => {
        let sum = 0;
        res.data()?.qualifications?.questions?.forEach((que) => {
          if (que?.conditions.hasOwnProperty("quotas")) {
            sum += Object.keys(que?.conditions?.quotas).length;
          }
        });
        setSurvey({ ...res.data(), quotas: sum });
        handleActiveLight(res.data()?.status, res.data()?.internal_status);
      }
    );
    onSnapshot(
      collection(
        db,
        "miratsinsights",
        "blaze",
        "surveys",
        String(surveyID),
        "Sessions"
      ),
      (res) => {
        let sessionsTmp = [],
          hits = 0,
          completed = 0,
          inClient = 0,
          terminates = 0,
          securityTerm = 0,
          overQuota = 0,
          completedSessionsData = [];
        res.forEach((session) => {
          let sd = session.data();
          sessionsTmp.push(sd);
          hits++;
          if (sd?.mirats_status === 3) inClient++;
          switch (sd?.client_status) {
            case 10:
              completed++;
              completedSessionsData.push(sd);
              break;
            case 20:
              terminates++;
              break;
            case 30:
              securityTerm++;
              break;
            case 40:
              overQuota++;
              break;
          }
        });
        setStatDetails({
          hits,
          completed,
          terminates,
          securityTerm,
          overQuota,
          inClient,
          conversion: ((completed / hits) * 100).toFixed(2),
          incidence: ((completed / inClient) * 100).toFixed(2),
          avgLoi: () => {
            let sum = 0;
            completedSessionsData?.map((session) => {
              sum += parseInt(session?.total_survey_time.split(":")[1]);
            });
            return (sum / completed).toFixed(0);
          },
          overQuotaInPercent: ((overQuota / inClient) * 100).toFixed(2),
          avgCpi: getAvgCpi(completedSessionsData),
          epc: ((getAvgCpi(completedSessionsData) * completed) / hits).toFixed(
            2
          ),
        });
        setLogs((prevData) => {
          return {
            ...prevData,
            live: sessionsTmp,
          };
        });
      }
    );

    getAllSessions(surveyID, "alpha").then((res) => {
      let testSessions = [];
      res?.forEach((session) => {
        testSessions.push(session.data());
      });
      setLogs((prevData) => {
        return {
          ...prevData,
          test: testSessions,
        };
      });
    });
  }, [surveyID]);

  const value = { survey, statDetails, teams, batti, logs, codes };
  return (
    <ClientDashbaordContext.Provider value={value}>
      {children}
    </ClientDashbaordContext.Provider>
  );
};

export default ClientDashboardContextProvider;
