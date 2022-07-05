import {
  getDoc,
  doc,
  getDocs,
  collection,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export const getAllEmployees = async () => {
  return await getDocs(collection(db, "miratsinsights", "peoples", "employee"));
};

export const getMiratsInsightsTeam = async () => {
  try {
    let peoples = {
      sales_managers: [],
      account_managers: [],
      project_managers: [],
    };
    const allEmps = await getAllEmployees();
    allEmps.forEach((empp) => {
      let emp = empp.data();
      let fullName = emp?.basicinfo?.firstname + " " + emp?.basicinfo?.lastname;
      let userID = emp?.UserID;
      let teamName = emp?.WorkDetails?.teamname;
      // --->> if its ayan ali then store in sales team and accounts team
      if (emp?.WorkDetails?.employeeID === "160620-1A") {
        peoples["sales_managers"].push({
          label: fullName,
          value: userID,
        });
        peoples["account_managers"].push({
          label: fullName,
          value: userID,
        });
        return;
      }
      // --->> if its janhavi ali then store in project managers team and accounts team
      if (emp?.WorkDetails?.employeeID === "250820-1A") {
        peoples["project_managers"].push({
          label: fullName,
          value: userID,
        });
        peoples["account_managers"].push({
          label: fullName,
          value: userID,
        });
        return;
      }
      switch (teamName) {
        case "Mirats OTC / illustrate Projects Support":
          peoples["project_managers"].push({
            label: fullName,
            value: userID,
          });
          break;
        case "Sales":
          peoples["sales_managers"].push({
            label: fullName,
            value: userID,
          });
      }
    });
    return peoples;
  } catch (error) {
    return error.message;
  }
};

export const getAllQuestionLibraryQuestions = async () => {
  const q = query(
    collection(db, "miratsinsights", "blaze", "question_library"),
    orderBy("question_id", "desc")
  );
  return await getDocs(q);
};

export const getAllSessions = async (surveyID, gamma) => {
  let sessionType = "Sessions";
  if (gamma === "alpha") sessionType = "TestSessions";
  const q = query(
    collection(
      db,
      "miratsinsights",
      "blaze",
      "surveys",
      String(surveyID),
      sessionType
    ),
    orderBy("date", "asc")
  );
  return await getDocs(q);
};

export const getSurvey = async (surveyID) => {
  const survey = await getDoc(
    doc(db, "miratsinsights", "blaze", "surveys", String(surveyID))
  );
  return survey.data();
};

export const getQuestion = async (questionNumber) => {
  return await getDoc(
    doc(
      db,
      "miratsinsights",
      "blaze",
      "question_library",
      String(questionNumber)
    )
  );
};

export const getErrorCodesForClientStatus = async () => {
  return await getDocs(
    query(collection(db, "miratsinsights", "blaze", "client_codes"))
  );
};

export const getErrorCodesForMiratsStatus = async () => {
  return await getDocs(
    query(collection(db, "miratsinsights", "blaze", "mirats_codes"))
  );
};

export const getAllSurveys = async () => {
  return await getDocs(collection(db, "miratsinsights", "blaze", "surveys"));
};

export const getAllClients = async () => {
  return await getDocs(collection(db, "miratsinsights", "spark", "customer"));
};

export const getClient = async (clientID) => {
  return await getDoc(doc(db, "miratsinsights", "spark", "customer", clientID));
};
