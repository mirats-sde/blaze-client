import React from "react";
import Box from "@mui/material/Box";
import styles from "./LogsModal.module.css";
import Modal from "@mui/material/Modal";
import { v4 as uuid } from "uuid";
import { useParams } from "react-router-dom";
import { useClientDashboardContext } from "../ClientDashboardContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 5,
  overflow: "auto",
  borderRadius: "30px",
};

const LogsModal = ({ data, openLogsModal, handleClose }) => {
  const { survey, codes } = useClientDashboardContext();
  const { surveyID } = useParams();

  return (
    <>
      <Modal
        open={openLogsModal.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className={styles.logs_modal}>
            <h1 className={styles.legend}>{openLogsModal.logsTypes} logs</h1>
            <div className={styles.logs_table}>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Ref_ID</th>
                    <th>Survey No</th>
                    <th>ProjectNo</th>
                    <th>Client Status</th>
                    <th>Mirats Status</th>
                    <th>qid_42 (Age)</th>
                    <th>Os</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((session) => {
                    return (
                      <tr key={uuid()}>
                        <td>{session?.date?.toDate().toLocaleString()}</td>
                        <td>{session?.ref_id}</td>
                        <td>{surveyID}</td>
                        <td>{survey?.project_id}</td>
                        <td>
                          {codes?.client_codes?.map((code) => {
                            if (code?.code === session?.client_status) {
                              return code?.m_desc;
                            }
                          })}{" "}
                          ({session?.client_status})
                        </td>
                        <td>
                          {codes?.mirats_codes?.map((code) => {
                            if (code?.code === session?.mirats_status) {
                              return code?.m_desc;
                            }
                          })}{" "}
                          ({session?.mirats_status})
                        </td>
                        <td>
                          {session?.responses?.map((resp) => {
                            if (resp?.question_id === "42") {
                              return resp?.user_response;
                            }
                          })}{" "}
                          years
                        </td>
                        <td>{session?.session_technical_details?.os}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default LogsModal;
