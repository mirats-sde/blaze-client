import styles from "./MainDashboard.module.css";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "./MainDashboard.css";
import { v4 as uuid } from "uuid";
import { Tooltip } from "@mui/material";
import { useHistory } from "react-router-dom";
import cx from "classnames";
import { useMainDashboardContext } from "./MainDashboardContext";
import { useParams } from "react-router-dom";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { useMemo, useState } from "react";
import { studyTypesData, surveyTypesData } from "./data";
import countryList from "react-select-country-list";
import Select from "react-select";

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

const selectCountryStyle = {
  menu: (provided, state) => ({
    ...provided,
    width: "100%",
    color: state.selectProps.menuColor,
    padding: "20px",
    zIndex: "999",
  }),
  control: (styles) => ({
    ...styles,
    width: "95%",
    border: "1px solid #8f8f8f",
    // boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    margin: "0.5rem 0.5rem",
  }),
  input: (styles) => ({
    ...styles,
    height: "2.5rem",
    width: "95%",
  }),
};

const MainDashboard = () => {
  const { surveySortBy, clientID } = useParams();
  const [filters, setFilters] = useState({});
  const history = useHistory();
  let clientURL = `/clients/${clientID}/`;

  const { clientSurveys, teams, client, statusesCnt } =
    useMainDashboardContext();
  const countries = useMemo(() => countryList().getData(), []);

  const handleFiltersChange = (field, e) => {
    setFilters((prevData) => {
      return {
        ...prevData,
        [field]: e.target.value,
      };
    });
  };
  return (
    <div className={styles.gmo_research_container}>
      <section className={styles.intro}>
        <p>
          {new Date().toLocaleString("default", {
            month: "long",
            day: "2-digit",
            year: "numeric",
          })}
        </p>
        <h1>
          {
            [
              "What are you doing that early?",
              "Good Morning",
              "Good Afternoon",
              "Good Evening",
            ][parseInt((new Date().getHours() / 24) * 4)]
          }{" "}
          {client?.company_name} team!
        </h1>
        <div className={styles.month_filter}>
          <select name="monthfilter" id="">
            <option>This month</option>
          </select>
          <p className={styles.project_recevied_txt}>
            <span className={styles.cnt}>{clientSurveys?.length}</span> projects
            received
          </p>
          <p className={styles.live_projects}>
            <span className={styles.cnt}>{statusesCnt?.live}</span> live
            projects
          </p>
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
              <select
                name="projmanager"
                value={filters?.pm ? filters?.pm : ""}
                onChange={(e) => handleFiltersChange("pm", e)}
              >
                <option value="">Select Project manager</option>
                {teams?.project_managers?.map((pm) => {
                  return (
                    <option value={pm?.value} key={pm?.value}>
                      {pm?.label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className={styles.filter_body}>
              <select name="projmanager" id="">
                <option value="projmanager">select study type</option>
                {studyTypesData?.map((type) => {
                  return <option value={type?.value}>{type?.label}</option>;
                })}
              </select>
            </div>
            <div className={styles.filter_body}>
              <Select
                styles={selectCountryStyle}
                options={countries}
                defaultValue=""
                value={filters?.country}
                onChange={(e) => {
                  setFilters((prevData) => {
                    return { ...prevData, country: e };
                  });
                }}
              />
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
                          <Tooltip title={survey?.survey_name} arrow>
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
                            className={cx(
                              survey?.internal_status
                                ? survey?.internal_status.replace(" ", "")
                                : survey?.status,
                              "survey_status"
                            )}
                          >
                            {survey?.internal_status?.length
                              ? survey?.internal_status
                              : survey?.status}
                          </span>
                        </div>

                        <div className={styles.project_id_and_internal_status}>
                          <span>
                            #{survey?.project_id} / {survey?.survey_id}
                          </span>
                          <span className={styles.country_flag}>
                            {getUnicodeFlagIcon(survey?.country?.country)}
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
                      <span className={styles.tableSubvalue}>completes</span>
                    </td>
                    {/* <td>{project.completes}</td> */}
                    <td>
                      {/* {project.CPI} */}
                      <span className={styles.tableValue}>
                        {survey?.avg_cpi}
                      </span>
                      <br />
                      <span className={styles.tableSubvalue}>
                        {survey?.client_info?.client_cost_currency}
                      </span>
                    </td>
                    <td>
                      {/* {project.IR} */}
                      <span className={styles.tableValue}>{survey?.ir}%</span>
                      <br />
                      <span className={styles.tableSubvalue}>in-field</span>
                    </td>
                    <td>
                      <span className={styles.tableValue}>{survey?.loi}</span>
                      <br />
                      <span className={styles.tableSubvalue}>mins</span>
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
                      </span>
                    </td>
                    <td>
                      {/* {project.EPC} */}
                      <span className={styles.tableValue}>{survey?.epc}</span>
                      <br />
                      <span className={styles.tableSubvalue}> USD</span>
                    </td>
                    <td>
                      <br />
                      <span
                        className={cx(styles.tableValue, styles.study_type)}
                      >
                        {survey?.study_type}
                      </span>
                      <br />
                      <span
                        className={cx(styles.tableSubvalue, styles.survey_type)}
                      >
                        {survey?.survey_type}
                      </span>
                    </td>
                    <td>
                      <span className={styles.tableValue}>
                        {survey?.creation_date.toDate()?.toDateString()}
                      </span>
                      <br />
                      <span className={styles.tableSubvalue}>
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
