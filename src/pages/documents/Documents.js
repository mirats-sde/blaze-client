import React from "react";
import Header from "../../components/Header/Header";
import { useDocumentContext } from "./DocumentsContext";
import styles from "./Documents.module.css";
import { v4 as uuid } from "uuid";

const Documents = () => {
  const { uploadedDocuments, documentLoading } = useDocumentContext();
  console.log(uploadedDocuments);
  return (
    <>
      <Header />
      <div className={styles.documents_page}>
        <div className={styles.survey_attachments_and_documents_container}>
          <h2>Survey Attachments and Documents </h2>
          {!documentLoading ? (
            <div className={styles.documents}>
              {uploadedDocuments?.length ? (
                uploadedDocuments?.map((doc) => {
                  return (
                    <div key={uuid()} className={styles.document}>
                      <span> {doc.file_name}</span>
                      <a
                        href={doc.file_url}
                        target="_blank"
                        className={styles.view_btn}
                      >
                        view
                      </a>
                    </div>
                  );
                })
              ) : (
                <p>No Documents Found</p>
              )}
            </div>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      </div>
    </>
  );
};

export default Documents;
