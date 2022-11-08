import {
  NextApiRequest,
  NextApiResponse,
} from "next";
import { useState, useEffect } from "react";
import createClient from "../../../graphql/client";
import dateFormat from "../../../utils/dateformat";
import styles from "../../../styles/Home.module.css";
import { CheckDetail, Vendor } from "../../../types/checkrequests";
import { GrantCheckRequest, GrantInfo } from "../../../types/grants";
import Link from "next/link";
import { GET_GRANTS, GRANT_CHECK_REQUEST } from "../../../graphql/queries";
import { getCookie } from "cookies-next";
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
  const end_date = new Date().toISOString();
  const start_date = new Date(2018, 0, 1);
  const response = await client.query({
    query: GRANT_CHECK_REQUEST,
    variables: {
      grant_id: grantID,
      start_date: start_date,
      end_date: end_date,
    },
  });
  const grants = await client.query({ query: GET_GRANTS });
  console.log(res);
  return {
    props: {
      base_report: jwt != undefined ? response.data.grant_check_requests : null,
      grant_list: jwt != undefined ? grants.data.all_grants : null,
      jwt: jwt ? jwt : "",
    },
  };
};
export default function GrantCheckRequestReport({
  base_report,
  grant_list,
  jwt,
}: {
  jwt: string;
  grant_list: GrantInfo[];
  base_report: GrantCheckRequest;
}) {
  const [start_date, setStart] = useState(new Date(2018, 0, 1).toISOString());
  const [end_date, setEnd] = useState(new Date().toISOString());
  const [selectedGrant, setSelectedGrant] = useState("H79TI082369");
  const [results, setResults] = useState(base_report);
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
        query: GRANT_CHECK_REQUEST,
        variables: {
          grant_id: selectedGrant,
          start_date: start_date,
          end_date: end_date,
        },
      });
      const new_data = res.data.grant_check_requests;
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
      <h1>{results.grant.name} Check Requests</h1>
      {results.total_amount != 0 ? (
        <>
          <h2>
            Total Amount: ${Math.floor(results.total_amount).toPrecision(4)}
          </h2>
          <div className="hr" />
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {results.vendors?.map((vendor: Vendor) => (
              <div key={vendor.name} className={styles.card}>
                <h2>{vendor.name}</h2>
                <p>{vendor.address.website}</p>
                <p>{vendor.address.street}</p>
                <p>
                  {vendor.address.city}, {vendor.address.state}
                </p>
              </div>
            ))}
          </div>
          <div className="hr" />
          <table>
            <thead>
              <th className="table-cell">Date</th>
              <th className="table-cell">Status</th>
              <th className="table-cell">Items</th>
              <th className="table-cell">Total</th>
            </thead>
            <tbody>
              {results.requests.map((request: CheckDetail) => {
                const { id, date, current_status, order_total, purchases } =
                  request;
                return (
                  <Link key={id} href={`/check_request/detail/${id}`}>
                    <tr id="table-row" className={current_status}>
                      <td className="table-cell">{dateFormat(date)}</td>
                      <td className="table-cell">{current_status}</td>
                      <td className="table-cell">{purchases?.length}</td>
                      <td className="table-cell">
                        ${Math.floor(order_total).toPrecision(4)}
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
