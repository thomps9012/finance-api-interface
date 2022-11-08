import Link from "next/link";
import styles from "../styles/Home.module.css";
import { getCookie } from "cookies-next";
import { GET_NOTIFICATIONS } from "../graphql/queries";
import { NextApiRequest, NextApiResponse } from "next";
import createClient from "../graphql/client";
export const getServerSideProps = async ({req, res}: {req: NextApiRequest, res: NextApiResponse}) => {
  const jwt = getCookie("jwt", {req, res});
  const client = createClient(jwt as string);
  const response = await client.query({ query: GET_NOTIFICATIONS });
  return {
    props: {
      notifications: jwt != undefined ? response.data.me.incomplete_action_count : 0,
      jwt: jwt ? jwt : "",
    },
  };
};
export default function Landing({admin, notifications}:{admin: boolean, notifications: number}) {
  return (
    <main className={styles.landing}>
      <br />
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <h1>Financial Request Hub</h1>
        <Link href={"/me/inbox"}>
          <a>
            <p className="req-overview">{notifications} New Action Items</p>
          </a>
        </Link>
      </header>
      <div className={styles.container}>
        <h2>🚗 Mileage </h2>
        <hr />
        <Link href={"/mileage/create"}>
          <a>
            <h3 style={{ fontWeight: 100 }}>New Request</h3>
          </a>
        </Link>
        <Link href={"/mileage"}>
          <a>
            <h3 style={{ fontWeight: 100 }}>All Actions</h3>
          </a>
        </Link>
        <br />
        <h2>💸 Petty Cash </h2>
        <hr />
        <Link href={"/petty_cash/create"}>
          <a>
            <h3 style={{ fontWeight: 100 }}>New Request</h3>
          </a>
        </Link>
        <Link href={"/petty_cash"}>
          <a>
            <h3 style={{ fontWeight: 100 }}>All Actions</h3>
          </a>
        </Link>
        <br />
        <h2>📑 Check Requests </h2>
        <hr />
        <Link href={"/check_request/create"}>
          <a>
            <h3 style={{ fontWeight: 100 }}>New Request</h3>
          </a>
        </Link>
        <Link href={"/check_request"}>
          <a>
            <h3 style={{ fontWeight: 100 }}>All Actions</h3>
          </a>
        </Link>
        <br />
        {admin && (
          <>
            <h2>👨‍👦‍👦 Users </h2>
            <hr />
            <Link href={"/users"}>
              <a>
                <h3 style={{ fontWeight: 100 }}>View All</h3>
              </a>
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
