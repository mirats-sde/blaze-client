import React from "react";
import styles from "./Securities.module.css";
import Header from "../../components/Header/Header";
import { useSecurityContext } from "./SecurityContext";

const Security = () => {
  const { securities, survey } = useSecurityContext();
  return (
    <>
      <Header />
      <div className={styles.secuirties_page}>
        <div className={styles.security_container}>
          <h2>Securities</h2>

          <div className={styles.security_table_container}>
            <table>
              <thead>
                <tr>
                  <th>Security Type</th>
                  <th>Enabled/Disabled</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.security_type}>Unique Fingerprint</td>
                  <td>
                    <span
                      className={
                        securities?.unique_fingerprint
                          ? styles.enabled
                          : styles.disabled
                      }
                    >
                      {securities?.unique_fingerprint ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className={styles.security_type}>Unique Ip Address</td>
                  <td>
                    <span
                      className={
                        securities?.unique_ip ? styles.enabled : styles.disabled
                      }
                    >
                      {securities?.unique_ip ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.security_type}>Unique RID</td>
                  <td>
                    <span
                      className={
                        securities?.unique_rid
                          ? styles.enabled
                          : styles.disabled
                      }
                    >
                      {securities?.unique_rid ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.blocked_ipc_container}>
          <h2>Blocked IP's</h2>

          {survey.blocked_ips?.length ? (
            <table>
              <tbody>
                <div className={styles.blocked_ips_container}>
                  {survey?.blocked_ips.map((ip) => {
                    return (
                      <tr>
                        <td>{ip}</td>
                      </tr>
                    );
                  })}
                </div>
              </tbody>
            </table>
          ) : (
            <p>No IP's found</p>
          )}
        </div>

        <div className={styles.blocked_rids_container}>
          <h2>Blocked RID's</h2>
          {survey?.blocked_rids?.length ? (
            <table>
              <tbody>
                {survey?.blocked_rids?.map((rid) => {
                  return (
                    <tr>
                      <td>{rid}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No RID's Found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Security;
