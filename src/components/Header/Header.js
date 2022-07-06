import React from "react";
import { NavLink, useParams } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../../assets/images/mirats_console_logo.png";
const Header = () => {
  const { clientID, surveyID } = useParams();
  const checkActive = (match, location) => {
    //some additional logic to verify you are in the home URI
    if (!location) return false;
    const { pathname } = location;
    return pathname === "/";
  };
  let navigationURL = `/${clientID}/a8e91843f173d7c5a5bd11b72ab43fd3`;
  return (
    <>
      <div className={styles.header}>
        <img src={logo} alt="" className={styles.header_logo} />
        <div className={styles.navigation_options}>
          <NavLink
            activeClassName={styles.activ_header_link}
            to={`${navigationURL}/dashboard/${surveyID}`}
            className={styles.header_link}
          >
            Dashboard
          </NavLink>
          <NavLink
            activeClassName={styles.activ_header_link}
            to={`${navigationURL}/qualifications/${surveyID}`}
            className={styles.header_link}
          >
            Qualifications
          </NavLink>
          <NavLink
            to={`${navigationURL}/analytics/audience/${surveyID}`}
            activeClassName={styles.activ_header_link}
            className={styles.header_link}
          >
            Analytics
          </NavLink>
          <NavLink
            to={`${navigationURL}/reports/${surveyID}`}
            activeClassName={styles.activ_header_link}
            className={styles.header_link}
          >
            Reports
          </NavLink>

          <NavLink
            to={`${navigationURL}/documents/${surveyID}`}
            activeClassName={styles.activ_header_link}
            className={styles.header_link}
          >
            Documents
          </NavLink>
          <NavLink
            to={`${navigationURL}/security/${surveyID}`}
            activeClassName={styles.activ_header_link}
            className={styles.header_link}
          >
            Security
          </NavLink>
          {/* <NavLink
						to='/reconciliations/10000006'
						activeClassName={styles.activ_header_link}
						className={styles.header_link}
					>
						Reconciliations
					</NavLink> */}
        </div>
      </div>
    </>
  );
};

export default Header;
