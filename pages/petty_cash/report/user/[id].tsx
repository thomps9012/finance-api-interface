import { NextApiRequest, NextApiResponse } from "next";
import { useState, useEffect } from "react";
import createClient from "../../../../graphql/client";
import { UserPettyCash, PettyCashDetail } from "../../../../types/pettycash";
import { UserInfo } from "../../../../types/users";
import dateFormat from "../../../../utils/dateformat";
import styles from "../../../../styles/Home.module.css";
import Link from "next/link";
import jwtDecode from "jwt-decode";
import { ALL_USERS, GET_USER_PETTY_CASH } from "../../../../graphql/queries";
import { CustomJWT } from "../../../../types/next-auth";
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
  const { id } = req.query;
  const decoded_token: CustomJWT = jwtDecode(jwt as string);
  const userID = decoded_token.id;
  const today = new Date().toISOString();
  const startDate = new Date(2018, 0, 1);
  const response = await client.query({
    query: GET_USER_PETTY_CASH,
    variables: {
      user_id: id != "null" ? id : userID,
      start_date: startDate,
      end_date: today,
    },
  });
  const users = await client.query({ query: ALL_USERS });
  return {
    props: {
      base_report: jwt != null ? response.data.user_petty_cash_requests : null,
      user_list: jwt != null ? users.data.all_users : null,
      userID: id != "null" ? id : userID,
      jwt: jwt ? jwt : "",
    },
  };
};
export default function UserPettyCashReport({
  base_report,
  userID,
  user_list,
  jwt,
}: {
  jwt: string;
  user_list: UserInfo[];
  userID: string;
  base_report: UserPettyCash;
}) {
    console.dir(base_report)
  const [start_date, setStart] = useState(new Date(2018, 0, 1).toISOString());
  const [end_date, setEnd] = useState(new Date().toISOString());
  const [selectedUserID, setSelectedUserID] = useState(userID);
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
      case "selectedUserID":
        setSelectedUserID(value);
        break;
    }
  };
  useEffect(() => {
    const fetch_data = async () => {
      const client = createClient(jwt);
      const res = await client.query({
        query: GET_USER_PETTY_CASH,
        variables: {
          user_id: selectedUserID,
          start_date: start_date,
          end_date: end_date,
        },
      });
      const new_data = res.data.user_petty_cash_requests;
      setResults(new_data);
    };
    fetch_data();
  }, [start_date, end_date, selectedUserID, jwt]);
  return (
    <main className={styles.main}>
      <div className={styles.inputRow}>
        <div className={styles.inputCol}>
          <h5>{dateFormat(start_date)}</h5>
          <h5>Start Date</h5>
          <hr />
          <input
            type="date"
            name="start_date"
            value={start_date}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputCol}>
          <h5>{dateFormat(end_date)}</h5>
          <h5>End Date</h5>
          <hr />
          <input
            type="date"
            name="end_date"
            value={end_date}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputCol}>
          <h3>
            {results.user.name}
          </h3>
          <h5>Employee</h5>
          <hr />
          <select
            name="selectedUserID"
            value={selectedUserID}
            onChange={handleChange}
          >
            {user_list.map((user: UserInfo) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <h1>
        {results.user.name}{" "}
        Petty Cash
      </h1>
      {results.total_amount != 0 ? (
          <>
          <h2>
            Total Amount - ${Math.floor(results.total_amount).toPrecision(4)}
          </h2>
          <div className="hr" />
          <table>
            <thead>
              <th className="table-cell">Date</th>
              <th className="table-cell">Status</th>
              <th className="table-cell">Amount</th>
              <th className="table-cell">Created @</th>
            </thead>
            <tbody>
              {results.requests?.map((request: PettyCashDetail) => {
                const { id, current_status, date, amount, created_at } =
                  request;
                return (
                  <Link href={`/petty_cash/detail/${id}`} key={id}>
                    <tr id="table-row" className={current_status}>
                      <td className="table-cell"> {dateFormat(date)}</td>
                      <td className="table-cell">{current_status}</td>
                      <td className="table-cell">
                        ${Math.floor(amount).toPrecision(4)}
                      </td>
                      <td className="table-cell"> {dateFormat(created_at)}</td>
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
