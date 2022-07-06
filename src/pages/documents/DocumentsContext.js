import { getDownloadURL, listAll, ref } from "firebase/storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { storage } from "../../firebase";
import { getSurvey } from "../../firebaseQueries";
import { decryptText } from "../../utils/enc-dec.utils";

const DocumentsContext = createContext();

export const useDocumentContext = () => {
  return useContext(DocumentsContext);
};

const DocumentsContextProvider = ({ children }) => {
  const { clientID, surveyID } = useParams();

  const history = useHistory();
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [documentLoading, setDocumentLoading] = useState(true);
  useEffect(() => {
    setDocumentLoading(true);
    const decryptedClientID = decryptText(clientID);
    getSurvey(surveyID)
      .then((data) => {
        if (data?.client_info?.client_id !== decryptedClientID) {
          history.push(`/${clientID}/a8e91843f173d7c5a5bd11b72ab43fd3/all`);
          return;
        }
      })
      .catch((err) => console.log(err.message));
    const folderRef = ref(storage, `Survey-attachement-documents/${surveyID}`);

    listAll(folderRef)
      .then((res) => {
        if (!res.items.length) setDocumentLoading(false);
        res.items.forEach((itemRef) => {
          // All the items under listRef.
          getDownloadURL(itemRef)
            .then((res) => {
              setUploadedDocuments((prevArr) => [
                ...prevArr,
                { file_name: itemRef.name, file_url: res },
              ]);
              setDocumentLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setDocumentLoading(false);
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [surveyID, clientID]);
  const value = { uploadedDocuments, documentLoading };
  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
};

export default DocumentsContextProvider;
