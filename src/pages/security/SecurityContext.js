import { createContext, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getSurvey } from "../../firebaseQueries";
import { decryptText } from "../../utils/enc-dec.utils";

const SecurityContext = createContext();

export const useSecurityContext = () => {
  return useContext(SecurityContext);
};

const SecuirtyContextProvider = ({ children }) => {
  const { clientID, surveyID } = useParams();

  const history = useHistory();
  const [survey, setSurvey] = useState({});
  const [securities, setSecurities] = useState({});
  useEffect(() => {
    const decryptedClientID = decryptText(clientID);

    getSurvey(surveyID).then((res) => {
      if (res?.client_info?.client_id !== decryptedClientID) {
        history.push(`/${clientID}/a8e91843f173d7c5a5bd11b72ab43fd3/all`);
        return;
      }
      setSurvey(res);
      setSecurities(res?.security_checks);
    });
  }, [surveyID, clientID]);
  const value = { securities, survey };
  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export default SecuirtyContextProvider;
