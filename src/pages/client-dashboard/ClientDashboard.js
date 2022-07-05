import styles from "./ClientDashboard.module.css";
import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import cx from "classnames";
import Header from "../../components/Header/Header";
import { useClientDashboardContext } from "./ClientDashboardContext";
import { useHistory } from "react-router-dom";
import LogsModal from "./logs-modal/LogsModal";
import { GoPrimitiveDot } from "react-icons/go";
import { green } from "@mui/material/colors";
import { Snackbar } from "@mui/material";
import { AiOutlineEdit } from "react-icons/ai";
import { studyTypesData, surveyTypesData } from "../main-dashboard/data";

const big_bar_status = [
  {
    name: "hits",
    value: "hits",
  },
  {
    name: "completed",
    value: "completed",
  },
  {
    name: "terminates",
    value: "terminates",
  },
  {
    name: "security terminates",
    value: "securityTerm",
  },
  {
    name: "over-quota",
    value: "overQuota",
  },
];

export const statusColors = {
  ongoing: "#827e02",
  lost: "#ba0000",
  won: "#598543",
  lead: "#808080",
  "soft lanuch": "#adf4b5",
  "full launch": "#5c9d65",
  tested: "#a22626",
  "not tested": "#ff9e81",
  reconciled: "#008000",
  "not reconciled": "#008000",
  paused: "#e62727",
  billed: "#808080",
};

const redirects = {
  completed:
    " https://moonknight.miratsinsights.com/7e08091a73b14e034889265e41ba796f91c766ad/[%RID%]/10",
  terminated:
    " https://moonknight.miratsinsights.com/7e08091a73b14e034889265e41ba796f91c766ad/[%RID%]/20",
  security_term:
    " https://moonknight.miratsinsights.com/7e08091a73b14e034889265e41ba796f91c766ad/[%RID%]/30",
  overQuota:
    " https://moonknight.miratsinsights.com/7e08091a73b14e034889265e41ba796f91c766ad/[%RID%]/40",
};

const ClientDashboard = () => {
  const history = useHistory();
  const { survey, statDetails, teams, batti, logs } =
    useClientDashboardContext();
  const [openAddClientPeopleModal, setOpenAddClientPeopleModal] =
    useState(false);
  const [openLogsModal, setOpenLogsModal] = useState({ open: false });

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <>
      {openLogsModal ? (
        <LogsModal
          openLogsModal={openLogsModal}
          handleClose={() => setOpenLogsModal({ open: false })}
          data={logs?.[openLogsModal.logsTypes]}
        />
      ) : null}

      {/* {openAddClientPeopleModal ? <AddClientPeopleModal /> : null} */}

      <Header />
      <div className={styles.client_dashboard_page}>
        <div className={styles.client_dashboard_top}>
          <div className={styles.left}>
            <div className={styles.survey_name_container}>
              <h3 className={styles.survey_full_name}>
                {survey?.client_info?.client_name}
              </h3>
              <h2 className={styles.survey_short_name}>
                {survey?.survey_name}
              </h2>
            </div>

            {/* survey number , project number and survey status container  */}
            <div className={styles.green_content_container}>
              <div className={styles.green_container}>
                <span className={styles.green_container_detail}>India</span>
                <span className={styles.green_container_detail}>
                  #SN{survey?.survey_id}
                </span>
                <span className={styles.green_container_detail}>
                  #PN{survey?.project_id}
                </span>
              </div>
              <div className={styles.survey_status}>
                <GoPrimitiveDot
                  size={30}
                  color={
                    statusColors[
                      survey?.internal_status
                        ? survey?.internal_status
                        : survey?.status
                    ]
                  }
                />
                <span className={styles.survey_status_span}>
                  {survey?.status}{" "}
                  {survey?.internal_status ? (
                    <span className={styles.survey_int_status_span}>
                      ({survey?.internal_status})
                    </span>
                  ) : null}
                </span>
              </div>
            </div>

            {/* survey stats container  */}
            <div className={styles.all_status_container}>
              <div className={styles.big_bar_container}>
                {big_bar_status?.map(({ name, value }) => {
                  return (
                    <div className={styles.b_bar} key={uuid()}>
                      <p className={styles.b_title}>{name}</p>
                      <p className={styles.b_count}>{statDetails[value]}</p>
                    </div>
                  );
                })}
              </div>
              <div className={styles.small_bar_container}>
                <div className={styles.s_bar}>
                  <p>
                    {" "}
                    <span style={{ fontWeight: 600 }}>
                      {statDetails.conversion} %
                    </span>{" "}
                    <span>conversion</span>{" "}
                  </p>
                </div>
                <div className={styles.s_bar}>
                  <p>
                    {" "}
                    <span style={{ fontWeight: 600 }}>
                      {statDetails?.incidence} %
                    </span>{" "}
                    <span>incidence</span>{" "}
                  </p>
                </div>
                <div className={styles.s_bar}>
                  <p>
                    {" "}
                    <span style={{ fontWeight: 600 }}>
                      {statDetails?.avgLoi ? statDetails?.avgLoi() : ""} mins
                    </span>{" "}
                    <span>avg LOI</span>{" "}
                  </p>
                </div>
                <div className={styles.s_bar}>
                  <p>
                    {" "}
                    <span style={{ fontWeight: 600 }}>
                      {statDetails?.overQuotaInPercent} %
                    </span>{" "}
                    <span>overquota</span>{" "}
                  </p>
                </div>
              </div>
            </div>

            {/* internal status container */}
            <div className={styles.below_progressbar_container}>
              <div className={styles.internal_status_container}>
                <div className={styles.internal_status}>
                  <div className={batti >= 1 ? styles.active : styles.inactive}>
                    <span className={cx(styles.round)}></span>
                    <span>Order received</span>
                  </div>
                  <div className={batti >= 2 ? styles.active : styles.inactive}>
                    <span className={cx(styles.round)}></span>
                    <span>Awarded</span>
                  </div>
                  <div className={batti >= 3 ? styles.active : styles.inactive}>
                    <span className={cx(styles.round)}></span>
                    <span>Soft Launch</span>
                  </div>

                  <div className={batti >= 4 ? styles.active : styles.inactive}>
                    <span className={cx(styles.round)}></span>
                    <span>full launch</span>
                  </div>
                  <div className={batti >= 5 ? styles.active : styles.inactive}>
                    <span className={cx(styles.round, styles.disabled)}></span>
                    <span>Reconcillation</span>
                  </div>
                  <div className={batti >= 6 ? styles.active : styles.inactive}>
                    <span className={cx(styles.round)}></span>
                    <span>Closed and Billed</span>
                  </div>
                </div>
                <div className={styles.cpi}>
                  <div className={styles.dark}>
                    <p>AVG.CPI</p>
                    <p>
                      {statDetails?.avgCpi}{" "}
                      {survey?.client_info?.client_cost_currency}
                    </p>
                  </div>
                  <div className={styles.light}>
                    <p>EPC</p>
                    <p style={{ fontWeight: 600 }}>
                      {statDetails?.epc}{" "}
                      {survey?.client_info?.client_cost_currency}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* survey setup  */}
            <div className={styles.survey_setup}>
              <h1>Setup</h1>
              <div className={styles.survey_setup_cards}>
                <div className={styles.setup_card}>
                  <p className={styles.title}>Survey Currency</p>
                  <p className={styles.value}>
                    {survey?.client_info?.client_cost_currency
                      ? survey?.client_info?.client_cost_currency
                      : "-"}
                  </p>
                </div>
                <div className={styles.setup_card}>
                  <p className={styles.title}>Business Unit</p>
                  <p className={styles.value}>
                    {survey?.business_unit ? survey?.business_unit : "-"}
                  </p>
                </div>
                <div className={styles.setup_card}>
                  <p className={styles.title}>Industry</p>
                  <p className={styles.value}>
                    {survey?.industry ? survey?.industry : "-"}
                  </p>
                </div>
                <div className={styles.setup_card}>
                  <p className={styles.title}>Country Lang</p>
                  <p className={styles.value}>
                    {survey?.country?.language
                      ? survey?.country?.language
                      : "-"}
                  </p>
                </div>
                <div className={styles.setup_card}>
                  <p className={styles.title}>Survey Status</p>
                  <p className={styles.value}>
                    {survey?.status ? survey?.status : "-"}
                  </p>
                </div>
                <div className={styles.setup_card}>
                  <p className={styles.title}>Internal Status</p>
                  <p className={styles.value}>
                    {survey?.internal_status ? survey?.internal_status : "-"}
                  </p>
                </div>
                <div className={styles.setup_card}>
                  <p className={styles.title}>Required N</p>
                  <p className={styles.value}>
                    {survey?.no_of_completes ? survey?.no_of_completes : "-"}
                  </p>
                </div>
                <div className={styles.setup_card}>
                  <p className={styles.title}>Expected IR</p>
                  <p className={styles.value}>
                    {survey?.expected_incidence_rate
                      ? survey?.expected_incidence_rate
                      : "-"}
                  </p>
                </div>
                <div className={styles.setup_card}>
                  <p className={styles.title}>Expected LOI</p>
                  <p className={styles.value}>
                    {survey?.expected_completion_loi
                      ? survey?.expected_completion_loi
                      : "-"}
                  </p>
                </div>
                <div className={styles.setup_card}>
                  <p className={styles.title}>Survey Number</p>
                  <p className={styles.value}>
                    {survey?.survey_id ? survey?.survey_id : "-"}
                  </p>
                </div>
                <div className={styles.setup_card}>
                  <p className={styles.title}>Project Number</p>
                  <p className={styles.value}>
                    {survey?.project_id ? survey?.project_id : "-"}
                  </p>
                </div>
                <div className={styles.setup_card}>
                  <p className={styles.title}>Survey Group Number</p>
                  <p className={styles.value}>
                    {survey?.survey_group ? survey?.survey_group : "-"}
                  </p>
                </div>
              </div>
              <h1>URL Setup & Costs</h1>
              <div className={styles.survey_setup_cards}>
                <div className={styles.setup_card}>
                  <p className={styles.title}>Client</p>
                  <p className={styles.value}>
                    {survey?.client_info?.client_name}
                  </p>
                </div>
                <div className={styles.setup_card}>
                  <p className={styles.title}>Client Avg Cost</p>
                  <p className={styles.value}>
                    {survey?.client_info?.client_cpi}
                  </p>
                </div>
                <div
                  className={cx(styles.setup_card, styles.client_email_card)}
                >
                  <p className={styles.title}>Client Coverage Email</p>
                  <p className={styles.value}>Ad-hoc</p>
                </div>

                <div className={cx(styles.setup_card, styles.survey_url_card)}>
                  <p className={styles.title}>Live URL</p>
                  <p className={styles.value}>{survey?.live_url}</p>
                </div>
                <div className={cx(styles.setup_card, styles.survey_url_card)}>
                  <p className={styles.title}>Test URL</p>
                  <p className={styles.value}>{survey?.test_url}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.survey_peoples_container}>
              <h2>Mirats Insights Team</h2>
              <div>
                <h3>Lead Project Managers</h3>
                <div className={styles.team}>
                  {teams?.project_managers?.map((perFullDetail) => {
                    return survey?.mirats_insights_team?.project_managers?.map(
                      (person) => {
                        if (perFullDetail?.value === person)
                          return <span>{perFullDetail?.label}</span>;
                      }
                    );
                  })}
                </div>
                <h3>Sales Managers</h3>
                <div className={styles.team}>
                  {teams?.sales_managers?.map((perFullDetail) => {
                    return survey?.mirats_insights_team?.sales_managers?.map(
                      (person) => {
                        if (perFullDetail?.value === person)
                          return <span>{perFullDetail?.label}</span>;
                      }
                    );
                  })}
                </div>
                <h3>Account Managers</h3>
                <div className={styles.team}>
                  {teams?.account_managers?.map((perFullDetail) => {
                    return survey?.mirats_insights_team?.account_managers?.map(
                      (person) => {
                        if (perFullDetail?.value === person)
                          return <span>{perFullDetail?.label}</span>;
                      }
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={styles.survey_peoples_container}>
              <h2>Clients Team</h2>
              <AiOutlineEdit
                size={24}
                onClick={() => setOpenAddClientPeopleModal(true)}
                style={{ cursor: "pointer" }}
              />
              <div>
                <h3>Lead Project Managers</h3>
                {/* <div className={styles.team}>
                  <span>Shruti Talukdar</span>
                </div> */}
                <h3>Sales Managers</h3>
                {/* <div className={styles.team}>
                  <span>Ayaan Ali</span>
                </div> */}
                <h3>Account Managers</h3>
                {/* <div className={styles.team}>
                  <span>Janhavi Rajput</span>
                </div> */}
              </div>
            </div>
            <div className={styles.survey_other_details}>
              <div className={styles.container}>
                <p className={styles.title}>CPI</p>
                <p className={styles.value}>
                  {survey?.client_info?.client_cost_currency_symbol}
                  {survey?.client_info?.client_cpi}
                </p>
              </div>
              <div className={styles.container}>
                <p className={styles.title}>Required</p>
                <p className={styles.value}>{survey?.no_of_completes}</p>
                <p className={styles.required_left_cnt}>
                  {survey?.no_of_completes - statDetails?.completed} left
                </p>
              </div>
              <div className={styles.container}>
                <p className={styles.title}>Qualifications</p>
                <p className={styles.value}>
                  {survey?.qualifications?.questions?.length} ques.
                </p>
              </div>
              <div className={styles.container}>
                <p className={styles.title}>Quotas</p>
                <p className={styles.value}>{survey?.quotas} quota</p>
              </div>
              <div className={styles.container}>
                <p className={styles.title}>Study Type</p>
                <p className={styles.value}>
                  {studyTypesData?.map((type) => {
                    if (type?.value === survey?.study_type) return type?.label;
                  })}
                </p>
              </div>
              <div className={styles.container}>
                <p className={styles.title}>Survey Type</p>
                <p className={styles.value}>
                  {surveyTypesData?.map((type) => {
                    if (type?.value === survey?.survey_type) return type?.label;
                  })}
                </p>
              </div>
            </div>

            <div className={styles.btns}>
              <button onClick={() => history.push(`/security/10000006`)}>
                View Security/Device Settings
              </button>
              <button
                onClick={() =>
                  setOpenLogsModal({ open: true, logsTypes: "live" })
                }
              >
                View Logs (Live){" "}
              </button>
              <button
                onClick={() =>
                  setOpenLogsModal({ open: true, logsTypes: "test" })
                }
              >
                View Logs (Test){" "}
              </button>
              <button onClick={() => history.push(`/qualifications/10000006`)}>
                View Qualifications / Prescreener{" "}
              </button>
            </div>
          </div>
        </div>
        {/* redirect and endpoints  */}
        <div className={styles.survey_redirects_and_endpoints}>
          <h1>redirects / endpoints</h1>
          <div className={styles.container}>
            <span className={styles.legend}>completed</span>
            <span className={styles.endpoint_url}>{redirects?.completed}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(redirects?.completed);
                setOpenSnackbar(true);
              }}
            >
              copy
            </button>
          </div>
          <div className={styles.container}>
            <span className={styles.legend}>terminated</span>
            <span className={styles.endpoint_url}>{redirects?.terminated}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(redirects?.terminated);
                setOpenSnackbar(true);
              }}
            >
              copy
            </button>
          </div>
          <div className={styles.container}>
            <span className={styles.legend}>security term</span>
            <span className={styles.endpoint_url}>
              {redirects?.security_term}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(redirects?.security_term);
                setOpenSnackbar(true);
              }}
            >
              copy
            </button>
          </div>
          <div className={styles.container}>
            <span className={styles.legend}>quota full</span>
            <span className={styles.endpoint_url}>{redirects?.overQuota}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(redirects?.overQuota);
                setOpenSnackbar(true);
              }}
            >
              copy
            </button>
          </div>
        </div>
      </div>

      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        TransitionComponent="TransitionLeft"
        message="Linked copied!"
        // key={transition ? transition.name : ""}
      />
    </>
  );
};

export default ClientDashboard;
