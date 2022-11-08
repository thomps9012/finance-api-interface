import { useEffect, useState } from "react";
import createClient from "../../../graphql/client";
import styles from "../../../styles/Home.module.css";
import { MileageDetail } from "../../../types/mileage";
import { GrantInfo, GrantMileage } from "../../../types/grants";
import dateFormat from "../../../utils/dateformat";
import Link from "next/link";
import { GET_GRANTS, GRANT_MILEAGE } from "../../../graphql/queries";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const jwt = getCookie("jwt", { req, res });
  const client = createClient(jwt);
  const grantID = "H79TI082369";
  const today = new Date().toISOString();
  const startDate = new Date(2018, 0, 1);
  const response = await client.query({
    query: GRANT_MILEAGE,
    variables: { grant_id: grantID, start_date: startDate, end_date: today },
  });
  const grants = await client.query({ query: GET_GRANTS });
  return {
    props: {
      base_report: jwt != undefined ? response.data.grant_mileage_report : null,
      grant_list: jwt != undefined ? grants.data.all_grants : null,
      jwt: jwt ? jwt : "",
    },
  };
};

export default function UserMonthlyMileageReport({
  base_report,
  jwt,
  grant_list,
}: {
  base_report: GrantMileage;
  grant_list: GrantInfo[];
  jwt: string;
}) {
  const [start_date, setStart] = useState(new Date(2018, 0, 1).toISOString());
  const [end_date, setEnd] = useState(new Date().toISOString());
  const [selectedGrant, setSelectedGrant] = useState("H79TI082369");
  const [results, setResults] = useState(base_report);
  console.log("base_report:", base_report);
  console.log("results", results);
  const handleChange = async (e: any) => {
    const { name, value } = e.target;
    switch (name) {
      case "start_date":
        setStart(new Date(value).toISOString());
        break;
      case "end_date":
        setEnd(new Date(value).toISOString());
        break;
      case "selectedGrant":
        setSelectedGrant(value);
        break;
    }
  };
  useEffect(() => {
    const fetch_data = async () => {
      const client = createClient(jwt);
      const res = await client.query({
        query: GRANT_MILEAGE,
        variables: {
          grant_id: selectedGrant,
          start_date: start_date,
          end_date: end_date,
        },
      });
      const new_data = res.data.grant_mileage_report;
      setResults(new_data);
    };
    fetch_data();
  }, [start_date, end_date, selectedGrant, jwt]);
  return (
    <main className={styles.main}>
      <div className={styles.inputRow}>
        <div className={styles.inputCol}>
          <h3>{dateFormat(start_date)}</h3>
          <h3>Start Date</h3>
          <hr />
          <input
            type="date"
            name="start_date"
            value={start_date}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputCol}>
          <h3>{dateFormat(end_date)}</h3>
          <h3>End Date</h3>
          <hr />
          <input
            type="date"
            name="end_date"
            value={end_date}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputCol}>
          <h3>{results.grant.name}</h3>
          <h3>Grant</h3>
          <hr />
          <select
            name="selectedGrant"
            value={selectedGrant}
            onChange={handleChange}
          >
            {grant_list.map((grant: GrantInfo) => (
              <option key={grant.id} value={grant.id}>
                {grant.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <h1>{results.grant.name} Mileage</h1>
      {results.reimbursement != 0 ? (
        <>
          <div className="hr" />
          <table>
            <tr>
              <th className="table-cell">Total Reimbursement</th>
              <td className="table-cell">
                ${Math.floor(results.reimbursement).toPrecision(4)}
              </td>
              <th className="table-cell">Total Mileage</th>
              <td className="table-cell">{results.mileage}</td>
            </tr>
            <tr>
              <th className="table-cell">Total Tolls</th>
              <td className="table-cell">{results.tolls}</td>
              <th className="table-cell">Total Parking</th>
              <td className="table-cell">{results.parking}</td>
            </tr>
          </table>
          <div className="hr" />
          <table>
            <thead>
              <th className="table-cell">Date</th>
              <th className="table-cell">Status</th>
              <th className="table-cell">Mileage</th>
              <th className="table-cell">Reimbursement</th>
            </thead>
            <tbody>
              {results.requests.map((request: MileageDetail) => {
                const {
                  id,
                  date,
                  current_status,
                  trip_mileage,
                  reimbursement,
                } = request;
                return (
                  <Link key={id} href={`/mileage/detail/${id}`}>
                    <tr id="table-row" className={current_status}>
                      <td className="table-cell">{dateFormat(date)}</td>
                      <td className="table-cell">{current_status}</td>
                      <td className="table-cell">{trip_mileage}</td>
                      <td className="table-cell">
                        ${Math.floor(reimbursement).toPrecision(4)}
                      </td>
                    </tr>
                  </Link>
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        <h2>No Requests during the Time Frame</h2>
      )}
      <hr />
    </main>
  );
}
