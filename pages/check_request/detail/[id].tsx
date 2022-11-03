import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import createClient from "../../../graphql/client";
import { Action, CheckDetail, Purchase } from "../../../types/checkrequests";
import dateFormat from "../../../utils/dateformat";
import { authOptions } from "../../api/auth/[...nextauth]";
import styles from "../../../styles/Home.module.css";
import { useRouter } from "next/router";
import jwtDecode from "jwt-decode";
import { GrantInfo } from "../../../types/grants";
import { CHECK_DETAIL, GET_GRANT } from "../../../graphql/queries";
import {
  APPROVE_CHECK_REQUEST,
  ARCHIVE_CHECK_REQUEST,
  REJECT_CHECK_REQUEST,
} from "../../../graphql/mutations";
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
  const res = await client.query({ query: CHECK_DETAIL, variables: { id } });
  const grant = await client.query({
    query: GET_GRANT,
    variables: { id: res.data.check_request_detail.grant_id },
  });

  return {
    props: {
      recorddata: sessionData ? res.data.check_request_detail : [],
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
  recorddata: CheckDetail;
  user_permissions: string[];
  userID: string;
}) {
  const [execReview, setExecReview] = useState(false);
  console.log(recorddata);
  const {
    id,
    current_user,
    category,
    receipts,
    purchases,
    created_at,
    credit_card,
    current_status,
    date,
    description,
    is_active,
    order_total,
    user_id,
    action_history,
  } = recorddata;
  const vendorName = recorddata.vendor.name;
  const router = useRouter();
  const { website, street, city, zip, state } = recorddata.vendor.address;
  const client = createClient(jwt);
  const approveRequest = async (e: any) => {
    const approval_status = StatusHandler({
      user_permissions: user_permissions,
      exec_review: execReview,
    });
    e.preventDefault();
    const res = await client.mutate({
      mutation: APPROVE_CHECK_REQUEST,
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
      mutation: REJECT_CHECK_REQUEST,
      variables: { request_id: id },
    });
    res.data.reject_request ? router.push("/me/inbox") : null;
  };
  const archiveRequest = async () => {
    const res = await client.mutate({
      mutation: ARCHIVE_CHECK_REQUEST,
      variables: { request_id: id },
    });
    res.data.archive_request ? router.push("/me") : null;
  };
  return (
    <main className={styles.main} id={is_active ? `active` : `inactive`}>
      <h1>
        {grant_info.name}{" "}
        <span className={current_status}>
          {category.split("_").join(" ")} Check Request
        </span>
      </h1>
      {userID === user_id &&
        (current_status === "REJECTED" || current_status === "PENDING") && (
          <Link href={`/check_request/edit/${id}`}>
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
      <h2>{dateFormat(date)}</h2>
      <h2>${order_total.toPrecision(4)}</h2>
      <p>{description}</p>
      <h3>Purchases</h3>
      {purchases.map((purchase: Purchase, i: number) => {
        const { amount, description, grant_line_item } = purchase;
        return (
          <div className={styles.card} key={i}>
            <p>{grant_line_item}</p>
            <p>{description}</p>
            <p>${amount}</p>
          </div>
        );
      })}
      <h3>Company Credit Card: {credit_card}</h3>
      <h3>Receipts</h3>
      {receipts.map((receipt: string, i: number) => (
        <>
          <Image
            key={i}
            src={receipt}
            height={300}
            width={300}
            alt={`receipt ${i}`}
          />
          <br />
        </>
      ))}
      <div className={styles.card}>
        <h2>{vendorName}</h2>
        <p>{website}</p>
        <p>{street}</p>
        <p>{city}</p>
        <p>{state}</p>
        <p>{zip}</p>
      </div>
      <h3>Created on {dateFormat(created_at)}</h3>
      <br />
      {(userID === user_id && current_status != "ARCHIVED") && (
        <button onClick={archiveRequest}>Archive Request</button>
      )}
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
