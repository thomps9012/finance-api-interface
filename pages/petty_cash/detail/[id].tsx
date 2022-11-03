import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import { Action } from "../../../types/checkrequests";
import { PettyCashDetail } from "../../../types/pettycash";
import dateFormat from "../../../utils/dateformat";
import { authOptions } from "../../api/auth/[...nextauth]";
import createClient from "../../../graphql/client";
import jwt_decode from "jwt-decode";
import { gql } from "@apollo/client";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../../../styles/Home.module.css";
import { GrantInfo } from "../../../types/grants";
import { GET_GRANT, PETTY_CASH_DETAIL } from "../../../graphql/queries";
import {
  APPROVE_PETTY_CASH,
  ARCHIVE_PETTY_CASH,
  REJECT_PETTY_CASH,
} from "../../../graphql/mutations";
import jwtDecode from "jwt-decode";
import { CustomJWT } from "../../../types/next-auth";
import { useState } from "react";
import StatusHandler from "../../../utils/statusHandler";

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
  const tokenData: CustomJWT = await jwtDecode(jwt as string);
  const user_permissions = tokenData.permissions;
  const userID = tokenData.id;
  const res = await client.query({
    query: PETTY_CASH_DETAIL,
    variables: { id },
  });
  const grant = await client.query({
    query: GET_GRANT,
    variables: { id: res.data.petty_cash_detail.grant_id },
  });
  return {
    props: {
      recorddata: sessionData ? res.data.petty_cash_detail : [],
      user_permissions: sessionData ? user_permissions : "",
      userID: sessionData ? userID : "",
      jwt: jwt ? jwt : "",
      grant_info: grant.data.single_grant,
    },
  };
};

export default function RecordDetail({
  recorddata,
  user_permissions,
  userID,
  jwt,
  grant_info,
}: {
  grant_info: GrantInfo;
  jwt: string;
  recorddata: PettyCashDetail;
  user_permissions: string[];
  userID: string;
}) {
  const [execReview, setExecReview] = useState(false);
  const router = useRouter();
  const {
    user_id,
    created_at,
    current_status,
    action_history,
    date,
    current_user,
    is_active,
    receipts,
    amount,
    description,
    id,
    category,
  } = recorddata;
  const client = createClient(jwt);
  const approveRequest = async (e: any) => {
    const approval_status = StatusHandler({
      user_permissions: user_permissions,
      exec_review: execReview,
    });
    e.preventDefault();
    const res = await client.mutate({
      mutation: APPROVE_PETTY_CASH,
      variables: {
        request_id: id,
        request_category: category,
        new_status: approval_status,
        exec_review: execReview,
      },
    });
    res.data.approve_request ? router.push("/me/inbox") : null;
  };
  const rejectRequest = async () => {
    const res = await client.mutate({
      mutation: REJECT_PETTY_CASH,
      variables: { request_id: id },
    });
    res.data.reject_request ? router.push("/me/inbox") : null;
  };
  const archiveRequest = async () => {
    const res = await client.mutate({
      mutation: ARCHIVE_PETTY_CASH,
      variables: { request_id: id },
    });
    res.data.archive_request ? router.push("/me") : null;
  };
  return (
    <main className={styles.main} id={is_active ? "active" : "inactive"}>
      <h1>
        {grant_info.name}{" "}
        <span className={current_status}>
          {category.split("_").join(" ")} Petty Cash Request
        </span>
      </h1>
      {userID === user_id &&
        (current_status === "REJECTED" || current_status === "PENDING") && (
          <Link href={`/petty_cash/edit/${id}`}>
            <a className={styles.editLink}>Edit Request</a>
          </Link>
        )}
      {user_permissions.find(() => "ADMIN") != undefined &&
        current_user === userID &&
        current_status != "REJECTED" && (
          <>
            <div className="button-row">
              <input
                name="exec_review"
                className="check-box"
                type="checkbox"
                onClick={() => setExecReview(!execReview)}
              />
              <label className="check-box-label">
                Flag for Executive Review
              </label>
            </div>
            <div className="button-row">
              <button onClick={approveRequest}>Approve</button>
              <button onClick={rejectRequest}>Reject</button>
            </div>
          </>
        )}
      <div className="hr" />
      <h3>{dateFormat(date)}</h3>
      <h3>${amount}</h3>
      <p>{description}</p>
      <h4>Receipts</h4>
      {receipts.map((receipt: string, i: number) => (
        <Image key={i} src={receipt} height={300} width={300} alt="" />
      ))}
      <br />
      <h4>Created {dateFormat(created_at)}</h4>
      {userID === user_id && current_status != "ARCHIVED" && (
        <button onClick={archiveRequest}>Archive Request</button>
      )}
      <br />
      <div className="hr" />
      <h4>Recent Actions</h4>
      <table>
        <thead>
          <th>User</th>
          <th>Status</th>
          <th>Date</th>
        </thead>
        <tbody>
          {action_history.slice(0, 3).map((action: Action) => {
            const { id, user, created_at, status } = action;
            return (
              <tr key={id} className={status}>
                <td className="table-cell">{user}</td>
                <td className="table-cell">{status}</td>
                <td className="table-cell">{dateFormat(created_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
