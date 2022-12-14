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
import { useRouter } from "next/router";
import {
  CLEAR_NOTIFICATION,
  CLEAR_ALL_NOTIFICATIONS,
} from "../../graphql/mutations";
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
      jwt: jwt ? jwt : "",
    },
  };
};

export default function MyInbox({
  userdata,
  jwt,
}: {
  userdata: UserOverview;
  jwt: string;
}) {
  const router = useRouter();
  const client = createClient(jwt);
  const { incomplete_actions, incomplete_action_count } = userdata;
  const clear_notification = async (action_id: string) => {
    const res = await client.mutate({
      mutation: CLEAR_NOTIFICATION,
      variables: { id: action_id },
    });
    res.data.clear_notification ? router.push("/me/inbox") : null;
  };
  const clear_all_notifications = async () => {
    const sure = confirm(
      "                                 *-*-*-*-*-*-*-*-*-*-*-*-*-*-* \n                                           WARNING \n                          YOU CANNOT UNDO THIS ACTION \n                      \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n Once you clear all notifications you will lose the request information from your inbox. cannot undo this action."
    );
    if (!sure) {
      return;
    }
    const res = await client.mutate({
      mutation: CLEAR_ALL_NOTIFICATIONS,
    });
    res.data.clear_all_notifications ? router.push("/me/inbox") : null;
  };
  return (
    <main className={styles.main}>
      <h1>
        {incomplete_action_count} New Action Item
        {incomplete_action_count != 1 && `s`}
      </h1>
      {incomplete_actions.length > 0 && (
        <>
          <a id="inbox-remove" onClick={clear_all_notifications}><h1>Clear Inbox</h1></a>
          <table>
            <thead>
              <th className="table-cell">Type</th>
              <th className="table-cell">Status</th>
              <th className="table-cell">Created At</th>
              <th className="table-cell">By</th>
              {/* <th className="table-cell" id="inbox-remove">
                Clear Notification
              </th> */}
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
                  <>
                    <a
                      style={{ textAlign: "right", right: -500, display: "inline", position: "relative" }}
                      id="inbox-remove"
                      onClick={() => clear_notification(id)}
                    >
                      Clear
                    </a>
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
                  </>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
