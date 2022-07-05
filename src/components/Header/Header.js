import React from "react";
import { NavLink, useParams } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../../assets/images/mirats_console_logo.png";
const Header = () => {
  const { surveyID } = useParams();
  const checkActive = (match, location) => {
    //some additional logic to verify you are in the home URI
    if (!location) return false;
    const { pathname } = location;
    return pathname === "/";
  };
  return (
    <>
      <div className={styles.header}>
        <img src={logo} alt="" className={styles.header_logo} />
        <div className={styles.navigation_options}>
          <NavLink
            activeClassName={styles.activ_header_link}
            to={`/dashboard/${surveyID}`}
            className={styles.header_link}
          >
            Dashboard
          </NavLink>
          <NavLink
            activeClassName={styles.activ_header_link}
            to={`/qualifications/${surveyID}`}
            className={styles.header_link}
          >
            Qualifications
          </NavLink>
          <NavLink
            to={`/analytics/audience/${surveyID}`}
            activeClassName={styles.activ_header_link}
            className={styles.header_link}
          >
            Analytics
          </NavLink>
          <NavLink
            to={`/reports/${surveyID}`}
            activeClassName={styles.activ_header_link}
            className={styles.header_link}
          >
            Reports
          </NavLink>

          <NavLink
            to={`/documents/${surveyID}`}
            activeClassName={styles.activ_header_link}
            className={styles.header_link}
          >
            Documents
          </NavLink>
          <NavLink
            to={`/security/${surveyID}`}
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
