import styles from "./MainDashboard.module.css";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { BiSearch } from "react-icons/bi";
import { v4 as uuid } from "uuid";
import { Tooltip } from "@mui/material";
import { useHistory } from "react-router-dom";
import cx from "classnames";
import { useMainDashboardContext } from "./MainDashboardContext";
import { useParams } from "react-router-dom";
import statusColors from "../client-dashboard/ClientDashboard";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MainDashboard = () => {
  const { surveySortBy, clientID } = useParams();
  const history = useHistory();
  let clientURL = `/clients/${clientID}/`;

  const { clientSurveys, teams, client, statusesCnt } =
    useMainDashboardContext();
  return (
    <div className={styles.gmo_research_container}>
      <section className={styles.intro}>
        <p>Monday, July 4</p>
        <h1>Good afternoon, {client?.company_name} team!</h1>
        <div className={styles.month_filter}>
          <select name="monthfilter" id="">
            <option>This month</option>
          </select>
          <p>{clientSurveys?.length} projects received</p>
          <p>{statusesCnt?.live} live projects</p>
        </div>
      </section>

      {/* surveys */}
      <div className={styles.survey_container}>
        <div className={styles.survey_with_filter}>
          <h1>Surveys</h1>
          <input
            type="text"
            placeholder="Search projects, surveys and much more"
            className={styles.search_field}
          />
        </div>

        {/* survey filters */}
        <div className={styles.filter_research_container}>
          <div className={styles.survey_filters_cards}>
            <div className={styles.filter_body}>
              <select name="projmanager" id="">
                <option value="projmanager">Project Manager</option>
              </select>
            </div>
            <div className={styles.filter_body}>
              <select name="projmanager" id="">
                <option value="projmanager">Project Manager</option>
              </select>
            </div>
            <div className={styles.filter_body}>
              <select name="projmanager" id="">
                <option value="projmanager">Project Manager</option>
              </select>
            </div>
            <div className={styles.filter_body}>
              <select name="projmanager" id="">
                <option value="projmanager">Project Manager</option>
              </select>
            </div>
            <div className={styles.filter_body}>
              <select name="projmanager" id="">
                <option value="projmanager">Project Manager</option>
              </select>
            </div>
            <div className={styles.filter_body}>
              <select name="projmanager" id="">
                <option value="projmanager">Project Manager</option>
              </select>
            </div>
          </div>
          <div className={styles.research_card}>
            <h1>{client?.company_name}</h1>
            <p>#{client?.id}</p>
          </div>
        </div>

        {/* tabs */}
        <div className={styles.tabs}>
          <span
            className={
              surveySortBy === "live"
                ? styles.active_status
                : styles.inactive_status
            }
            onClick={() => history.push(clientURL + "live")}
          >
            LIVE ({statusesCnt?.live ? statusesCnt?.live : 0})
          </span>
          <span
            className={
              surveySortBy === "awarded"
                ? styles.active_status
                : styles.inactive_status
            }
            onClick={() => history.push(clientURL + "awarded")}
          >
            AWARDED ({statusesCnt?.awarded ? statusesCnt?.awarded : 0})
          </span>
          <span
            className={
              surveySortBy === "paused"
                ? styles.active_status
                : styles.inactive_status
            }
            onClick={() => history.push(clientURL + "paused")}
          >
            PAUSED ({statusesCnt?.paused ? statusesCnt?.paused : 0})
          </span>

          <span
            className={
              surveySortBy === "completed"
                ? styles.active_status
                : styles.inactive_status
            }
            onClick={() => history.push(clientURL + "completed")}
          >
            COMPLETED ({statusesCnt?.completed ? statusesCnt?.completed : 0})
          </span>

          <span
            className={
              surveySortBy === "billed"
                ? styles.active_status
                : styles.inactive_status
            }
            onClick={() => history.push(clientURL + "billed")}
          >
            BILLED ({statusesCnt?.billed ? statusesCnt?.billed : 0})
          </span>
          <span
            className={
              surveySortBy === "all"
                ? styles.active_status
                : styles.inactive_status
            }
            onClick={() => history.push(clientURL + "all")}
          >
            ALL ({statusesCnt?.all})
          </span>
        </div>

        {/* client surveys table  */}
        <div className={styles.client_surveys_table_container}>
          <table className={styles.client_surveys_table}>
            <thead>
              <tr className={styles.cell_large}>
                <th
                  style={{
                    width: "370px",
                    textAlign: "center",
                  }}
                >
                  Survey Name
                  <p className={styles.headingDescription}>
                    Project No / Survey No | Client | Status
                  </p>
                </th>
                <th>
                  Progress
                  <p className={styles.headingDescription}>Compl./Hits</p>
                </th>
                <th>
                  Avg. Cost
                  <p className={styles.headingDescription}>per complete</p>
                </th>
                <th>
                  IR
                  <p className={styles.headingDescription}>compl./session</p>
                </th>
                <th>
                  LOI
                  <p className={styles.headingDescription}>avg</p>
                </th>
                <th>
                  Project Managers
                  <p className={styles.headingDescription}>lead</p>
                </th>
                <th>
                  EPC
                  <p className={styles.headingDescription}>per click</p>
                </th>
                <th>
                  Study Type
                  <p className={styles.headingDescription}>Survey Type</p>
                </th>
                {/* <th>Country</th> */}
                <th>
                  Launch Date
                  <p className={styles.headingDescription}>days ago</p>
                </th>
              </tr>
            </thead>

            <tbody>
              {clientSurveys?.map((survey) => {
                return (
                  <tr key={uuid()} className={styles.dataRow}>
                    <td className={styles.project_table_first_col}>
                      <input
                        type="checkbox"
                        // checked={checkRows?.includes(String(project?.survey_id))}
                        // name={project?.survey_id}
                        // onChange={handleSelect}
                      />
                      <div className={styles.coldiv}>
                        <div className={styles.project_name_and_status}>
                          <Tooltip
                            title=""
                            content={
                              <TooltipForSurveyName name="abcd survey" />
                            }
                          >
                            <label
                              htmlFor="vehicle1"
                              onClick={() =>
                                history.push(`/dashboard/${survey?.survey_id}`)
                              }
                              className={styles.project_name}
                            >
                              {survey?.survey_name}{" "}
                            </label>
                          </Tooltip>

                          <span
                            className={
                              styles +
                              "." +
                              statusColors[
                                survey?.internal_status
                                  ? survey?.internal_status
                                  : survey?.status
                              ]
                            }
                          >
                            {survey?.internal_status?.length
                              ? survey?.internal_status
                              : survey?.status}
                          </span>
                        </div>

                        <br />
                        <div className={styles.project_id_and_internal_status}>
                          <span>
                            #{survey?.project_id} / {survey?.survey_id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      {/* {project?.progress} / {project?.totalSurvey} */}
                      <span className={styles.tableValue}>
                        {survey?.completes}/{survey?.no_of_completes}
                      </span>
                      <br />
                      <span>completes</span>
                    </td>
                    {/* <td>{project.completes}</td> */}
                    <td>
                      {/* {project.CPI} */}
                      <span className={styles.tableValue}>
                        {survey?.avg_cpi}
                      </span>
                      <br />
                      <span>{survey?.client_info?.client_cost_currency}</span>
                    </td>
                    <td>
                      {/* {project.IR} */}
                      <span className={styles.tableValue}>{survey?.ir}%</span>
                      <br />
                      <span>in-field</span>
                    </td>
                    <td>
                      <span className={styles.tableValue}>{survey?.loi}</span>
                      <br />
                      <span>mins</span>
                    </td>
                    <td>
                      <span
                        className={cx(
                          styles.tableValue,
                          styles.project_manager_container
                        )}
                      >
                        {/* showing only the first lead project manager  */}
                        {teams?.project_managers?.map((pm) => {
                          if (
                            pm?.value ===
                            survey?.mirats_insights_team?.project_managers[0]
                          ) {
                            return pm?.label;
                          }
                        })}
                        {/* {survey?.mirats_insights_team?.project_managers[0]} */}
                      </span>
                    </td>
                    <td>
                      {/* {project.EPC} */}
                      <span className={styles.tableValue}>{survey?.epc}</span>
                      <br />
                      <span> USD</span>
                    </td>
                    <td>
                      <br />
                      <p className={styles.study_type}>{survey?.study_type}</p>
                      <p className={styles.survey_type}>
                        {survey?.survey_type}
                      </p>
                    </td>
                    <td>
                      <span className={styles.tableValue}>
                        {survey?.creation_date.toDate()?.toDateString()}
                      </span>
                      <br />
                      <span>
                        {(
                          (new Date().getTime() -
                            survey?.creation_date.toDate()?.getTime()) /
                          (1000 * 3600 * 24)
                        ).toFixed(0)}{" "}
                        Days ago
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TooltipForSurveyName = ({ name }) => {
  return (
    <>
      <p>{name}</p>
    </>
  );
};

export default MainDashboard;
