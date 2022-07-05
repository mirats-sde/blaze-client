import { doc, onSnapshot } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { getAllQuestionLibraryQuestions } from "../../firebaseQueries";

const QualificationsContext = createContext();

export const useQualificationsContext = () => {
  return useContext(QualificationsContext);
};

const QualificationsContextProvider = ({ children }) => {
  const [survey, setSurvey] = useState([]);
  const [allQues, setAllQues] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const { surveyID } = useParams();

  useEffect(() => {
    getAllQuestionLibraryQuestions().then((res) => {
      let quesTmp = [];
      res.forEach((que) => {
        quesTmp.push(que.data());
      });
      setAllQues(quesTmp);
    });
  }, []);
  useEffect(() => {
    setQuestionsLoading(true);
    onSnapshot(
      doc(db, "miratsinsights", "blaze", "surveys", String(surveyID)),
      (res) => {
        let newQualifications = [];
        res.data()?.qualifications?.questions?.map((que) => {
          allQues?.map((libraryQue) => {
            if (libraryQue?.question_id === que?.question_id) {
              newQualifications.push({
                ...que,
                ...libraryQue?.lang[res.data()?.country?.code],
                question_type: libraryQue?.question_type,
              });
            }
          });
          setQuestionsLoading(false);
        });
        let surveyData = res.data();
        surveyData.qualifications.questions = newQualifications;
        setSurvey(surveyData);
      }
    );
  }, [surveyID, allQues]);

  const value = { survey, questionsLoading };
  return (
    <QualificationsContext.Provider value={value}>
      {children}
    </QualificationsContext.Provider>
  );
};

export default QualificationsContextProvider;
