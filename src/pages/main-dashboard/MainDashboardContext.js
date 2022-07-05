import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import {
  getAllSessions,
  getAllSurveys,
  getClient,
  getMiratsInsightsTeam,
} from "../../firebaseQueries";

const MainDashboardContext = createContext();

export const useMainDashboardContext = () => {
  return useContext(MainDashboardContext);
};

const MainDashboardContextProvider = ({ children }) => {
  const { clientID } = useParams();
  const [clientSurveys, setClientSurveys] = useState([]);
  const [client, setClient] = useState({});
  const [statusesCnt, setStatusCnt] = useState({});
  const [teams, setTeams] = useState({});
  useEffect(() => {
    getMiratsInsightsTeam().then((res) => {
      setTeams(res);
    });
  }, []);

  useEffect(() => {
    getAllSurveys().then((res) => {
      res.forEach(async (survey) => {
        let surveyData = survey.data();
        let completes = 0,
          inClients = 0;
        let sid = surveyData?.survey_id;
        let cpiSum = 0,
          surveyTimeSum = 0;

        if (surveyData?.client_info?.client_id === clientID) {
          setStatusCnt((prevData) => {
            return {
              ...prevData,
              [surveyData?.status]:
                (prevData[surveyData?.status]
                  ? prevData[surveyData?.status]
                  : 0) + 1,
              all: (prevData?.all ? prevData?.all : 0) + 1,
            };
          });

          const result = await getAllSessions(sid);
          result.forEach((res) => {
            if (res.data()?.client_status === 10) {
              cpiSum += parseInt(res.data()?.client_cpi);
              surveyTimeSum += parseInt(
                res.data()?.total_survey_time.split(":")[1]
              );
              completes++;
            }
            if (res.data()?.mirats_status === 3) {
              inClients++;
            }
          });
          surveyData["completes"] = completes;
          surveyData["hits"] = result.docs.length;
          surveyData["avg_cpi"] = (cpiSum / completes).toFixed(2);
          surveyData["ir"] = ((completes / inClients) * 100).toFixed(2);
          surveyData["loi"] = (surveyTimeSum / completes).toFixed(0);
          setClientSurveys((prevData) => [...prevData, surveyData]);
        }
      });
    });

    getClient(clientID).then((res) => {
      setClient(res.data());
    });
  }, [clientID]);

  const value = { clientSurveys, teams, client, statusesCnt };
  return (
    <MainDashboardContext.Provider value={value}>
      {children}
    </MainDashboardContext.Provider>
  );
};

export default MainDashboardContextProvider;
