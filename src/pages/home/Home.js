import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getAllClients } from "../../firebaseQueries";
import { encryptText } from "../../utils/enc-dec.utils";

const Home = () => {
  const [clients, setClients] = useState([]);

  const history = useHistory();
  useEffect(() => {
    getAllClients().then((res) => {
      let clientsTmp = [];
      res.forEach((client) => {
        clientsTmp.push(client.data());
      });
      setClients(clientsTmp);
    });
  });

  const handleClientClick = (clientID) => {
    const encryptedClientID = encryptText(String(clientID));
    history.push(`/${encryptedClientID}/a8e91843f173d7c5a5bd11b72ab43fd3/all`);
  };
  return (
    <>
      <div>
        <h1>All Clients</h1>
        {clients?.map((client, index) => {
          return (
            <div key={index}>
              <span onClick={() => handleClientClick(client.id)}>
                {" "}
                {client?.company_name}
              </span>
              <br />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Home;
