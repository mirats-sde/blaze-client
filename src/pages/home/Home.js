import React, { useEffect, useState } from "react";
import { getAllClients } from "../../firebaseQueries";

const Home = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    getAllClients().then((res) => {
      let clientsTmp = [];
      res.forEach((client) => {
        clientsTmp.push(client.data());
      });
      setClients(clientsTmp);
    });
  });
  return (
    <>
      <div>
        <h1>All Clients</h1>
        {clients?.map((client) => {
          return (
            <div>
              <a href={`/clients/${client?.id}/all`}> {client?.company_name}</a>
              <br />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Home;
