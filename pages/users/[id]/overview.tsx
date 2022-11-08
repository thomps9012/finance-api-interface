import { NextApiRequest, NextApiResponse } from "next";
import { UserOverview } from "../../../types/users";
import dateFormat from "../../../utils/dateformat";
import createClient from "../../../graphql/client";
import styles from "../../../styles/Home.module.css";
import Link from "next/link";
import { USER_OVERVIEW } from "../../../graphql/queries";
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
  const response = await client.query({ query: USER_OVERVIEW, variables: { id } });
  return {
    props: {
      userdata: jwt != undefined ? response.data.user_overview : [],
    },
  };
};

export default function UserRecordOverview({
  userdata,
}: {
  userdata: UserOverview;
}) {
  const { name, id, incomplete_action_count, last_login, permissions } =
    userdata;
  const { mileage_requests, check_requests, petty_cash_requests } = userdata;
  return (
    <main className={styles.container}>
      <h1>{name}</h1>
      <p>{incomplete_action_count} Incomplete Actions</p>
      <p>Last Login: {dateFormat(last_login)}</p>
      {/* <h1>Data for {name} <Link href={`/users/${userdata.id}/edit`}><a>✏️</a></Link></h1> */}
      <h3>Permissions </h3>
      {permissions.map((permission) => (
        <p key={permission}>{permission}</p>
      ))}
      <div className="hr" />
      <h2>Request Overview</h2>
      <div
        style={{
          margin: 10,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flexDirection: "column" }}>
          {mileage_requests.total_requests > 0 ? (
            <>
              <h1>Mileage</h1>
              <Link href={`/me/mileage`}>
                <a>
                  <p className="req-overview">View All</p>
                </a>
              </Link>
              <p className="req-overview">
                {mileage_requests.total_requests} Total Request
                {mileage_requests.total_requests > 1 && "s"}
              </p>
              <Link
                href={`/mileage/detail/${mileage_requests.last_request.id}`}
              >
                <a>
                  <h1>
                    Most Recent{" "}
                    <span
                      className={mileage_requests.last_request.current_status}
                    >
                      {mileage_requests.last_request.current_status
                        .split("_")
                        .join(" ")}{" "}
                      Request
                    </span>
                  </h1>
                </a>
              </Link>
              <p className="req-overview">
                Date - {dateFormat(mileage_requests.last_request.date)}
              </p>
              <p className="req-overview">
                Created - {dateFormat(mileage_requests.last_request.created_at)}
              </p>
            </>
          ) : (
            <h1 className="ARCHIVED">
              {mileage_requests.total_requests} Mileage Requests
            </h1>
          )}
        </div>
        <div className="hr" />
        <div style={{ flexDirection: "column" }}>
          {check_requests.total_requests > 0 ? (
            <>
              <h1> Check Requests</h1>
              <Link href={`/me/checkRequests`}>
                <a>
                  <p className="req-overview">View All</p>
                </a>
              </Link>
              <p className="req-overview">
                {check_requests.total_requests} Total Request
                {check_requests.total_requests > 1 && "s"}
              </p>
              <Link
                href={`/check_request/detail/${check_requests.last_request.id}`}
              >
                <a>
                  <h1>
                    Most Recent{" "}
                    <span
                      className={check_requests.last_request.current_status}
                    >
                      {check_requests.last_request.current_status
                        .split("_")
                        .join(" ")}{" "}
                      Request
                    </span>
                  </h1>
                </a>
              </Link>
              <p className="req-overview">
                Date - {dateFormat(check_requests.last_request.date)}
              </p>
              <p className="req-overview">
                Created - {dateFormat(check_requests.last_request.created_at)}
              </p>
            </>
          ) : (
            <h1 className="ARCHIVED">
              {check_requests.total_requests} Check Requests
            </h1>
          )}
        </div>
        <div className="hr" />
        <div style={{ flexDirection: "column" }}>
          {petty_cash_requests.total_requests > 0 ? (
            <>
              <h1>Petty Cash Requests</h1>
              <Link href={`/me/pettyCash`}>
                <a>
                  <p className="req-overview">View All</p>
                </a>
              </Link>
              <p className="req-overview">
                {petty_cash_requests.total_requests} Total Request
                {petty_cash_requests.total_requests > 1 && "s"}
              </p>
              <Link
                href={`/petty_cash/detail/${petty_cash_requests.last_request.id}`}
              >
                <a>
                  <h1>
                    Most Recent{" "}
                    <span
                      className={
                        petty_cash_requests.last_request.current_status
                      }
                    >
                      {petty_cash_requests.last_request.current_status
                        .split("_")
                        .join(" ")}{" "}
                      Request
                    </span>
                  </h1>
                </a>
              </Link>
              <p className="req-overview">
                Date - {dateFormat(petty_cash_requests.last_request.date)}
              </p>
              <p className="req-overview">
                Created -{" "}
                {dateFormat(petty_cash_requests.last_request.created_at)}
              </p>
            </>
          ) : (
            <h1 className="ARCHIVED">
              {petty_cash_requests.total_requests} Petty Cash Requests
            </h1>
          )}
        </div>
      </div>
    </main>
  );
}
