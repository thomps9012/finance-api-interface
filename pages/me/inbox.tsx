import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import createClient from "../../graphql/client";
import { authOptions } from "../api/auth/[...nextauth]";
import dateFormat from "../../utils/dateformat";
import Link from "next/link";
import { UserOverview } from "../../types/users";
import { Action } from "../../types/checkrequests";
import styles from "../../styles/Home.module.css";
import { GET_MY_INBOX } from "../../graphql/queries";
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const sessionData = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  const jwt = sessionData?.user.token;
  const client = createClient(jwt);
  const res = await client.query({ query: GET_MY_INBOX });
  return {
    props: {
      userdata: sessionData ? res.data.me : [],
    },
  };
};

export default function MyInbox({ userdata }: { userdata: UserOverview }) {
  const { incomplete_actions, incomplete_action_count } = userdata;
  console.table(incomplete_actions);
  return (
    <main className={styles.main}>
      <h1>
        {incomplete_action_count} New Action Item
        {incomplete_action_count != 1 && `s`}
      </h1>
      {incomplete_actions.length > 0 && (
        <>
          <table>
            <thead>
              <th className="table-cell">Type</th>
              <th className="table-cell">Status</th>
              <th className="table-cell">Created At</th>
              <th className="table-cell">By</th>
            </thead>
            <tbody>
              {incomplete_actions?.map((action: Action) => {
                const {
                  id,
                  request_id,
                  request_type,
                  user,
                  status,
                  created_at,
                } = action;
                var request_nav: string;
                if (request_type === "CHECK") {
                  request_nav = "check_request";
                } else {
                  request_nav = request_type.toLowerCase();
                }
                return (
                  <Link href={`/${request_nav}/detail/${request_id}`} key={id}>
                    <tr id="table-row" key={id} className={status}>
                      <td className="table-cell">
                        {request_type.split("_").join(" ")}
                      </td>
                      <td className="table-cell">
                        {status.split("_").join(" ")}
                      </td>
                      <td className="table-cell">{dateFormat(created_at)}</td>
                      <td className="table-cell">{user}</td>
                    </tr>
                  </Link>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
