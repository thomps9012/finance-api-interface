import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { UserOverview } from "../../../types/users";
import dateFormat from "../../../utils/dateformat";
import { authOptions } from "../../api/auth/[...nextauth]";
import createClient from "../../../graphql/client";
import styles from "../../../styles/Home.module.css";
import Link from "next/link";
import { USER_OVERVIEW } from "../../../graphql/queries";
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.query;
  const sessionData = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  const jwt = sessionData?.user.token;
  const client = createClient(jwt);
  const res = await client.query({ query: USER_OVERVIEW, variables: { id } });
  console.log(res.data, "user overview");
  return {
    props: {
      userdata: sessionData ? res.data.user_overview : [],
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
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
           <div style={{ flexDirection: "column" }}>
          {mileage_requests.total_requests > 0 ? (
            <>
              <Link href={`/me/mileage`}>
                <a>
                  <h3>Mileage</h3>
                  View All
                </a>
              </Link>
              <p>
                {mileage_requests.total_requests} Total Request
                {mileage_requests.total_requests > 1 && "s"}
              </p>
              <Link
                href={`/mileage/detail/${mileage_requests.last_request.id}`}
              >
                <a>
                  <h4>
                    Most Recent{" "}
                    <span
                      className={mileage_requests.last_request.current_status}
                    >
                      {mileage_requests.last_request.current_status
                        .split("_")
                        .join(" ")}{" "}
                      Request
                    </span>
                  </h4>
                </a>
              </Link>
              <p>Date - {dateFormat(mileage_requests.last_request.date)}</p>
              <p>
                Created - {dateFormat(mileage_requests.last_request.created_at)}
              </p>
            </>
          ) : (
            <p className="ARCHIVED">
              {mileage_requests.total_requests} Mileage Requests
            </p>
          )}
        </div>
        <div style={{ flexDirection: "column" }}>
          {check_requests.total_requests > 0 ? (
            <>
              <Link href={`/me/checkRequests`}>
                <a>
                  <h3> Check Requests</h3>
                  View All
                </a>
              </Link>
              <p>
                {check_requests.total_requests} Total Request
                {check_requests.total_requests > 1 && "s"}
              </p>
              <Link
                href={`/check_request/detail/${check_requests.last_request.id}`}
              >
                <a>
                  <h4>
                    Most Recent{" "}
                    <span
                      className={check_requests.last_request.current_status}
                    >
                      {check_requests.last_request.current_status
                        .split("_")
                        .join(" ")}{" "}
                      Request
                    </span>
                  </h4>
                </a>
              </Link>
              <p>Date - {dateFormat(check_requests.last_request.date)}</p>
              <p>
                Created - {dateFormat(check_requests.last_request.created_at)}
              </p>
            </>
          ) : (
            <p className="ARCHIVED">
              {check_requests.total_requests} Check Requests
            </p>
          )}
        </div>
        <div style={{ flexDirection: "column" }}>
          {petty_cash_requests.total_requests > 0 ? (
            <>
              <Link href={`/me/pettyCash`}>
                <a>
                  <h3>Petty Cash Requests</h3>
                  View All
                </a>
              </Link>
              <p>
                {petty_cash_requests.total_requests} Total Request
                {petty_cash_requests.total_requests > 1 && "s"}
              </p>
              <Link
                href={`/petty_cash/detail/${petty_cash_requests.last_request.id}`}
              >
                <a>
                  <h4>
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
                  </h4>
                </a>
              </Link>
              <p>Date - {dateFormat(petty_cash_requests.last_request.date)}</p>
              <p>
                Created -{" "}
                {dateFormat(petty_cash_requests.last_request.created_at)}
              </p>
            </>
          ) : (
            <p className="ARCHIVED">
              {petty_cash_requests.total_requests} Petty Cash Requests
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
