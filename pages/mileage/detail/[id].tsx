import { GetServerSidePropsContext } from "next";
import { authOptions } from "../../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { MileageDetail } from "../../../types/mileage";
import { Action } from "../../../types/checkrequests";
import dateFormat from "../../../utils/dateformat";
import createClient from "../../../graphql/client";
import styles from "../../../styles/Home.module.css";
import { gql } from "@apollo/client";
import Link from "next/link";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";
import { GrantInfo } from "../../../types/grants";
import { GET_GRANT, MILEAGE_DETAIL } from "../../../graphql/queries";
import { CustomJWT } from "../../../types/next-auth";
import { useState } from "react";
import StatusHandler from "../../../utils/statusHandler";
import {
  APPROVE_MILEAGE,
  ARCHIVE_MILEAGE,
  REJECT_MILEAGE,
} from "../../../graphql/mutations";

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
  const res = await client.query({ query: MILEAGE_DETAIL, variables: { id } });
  const grant = await client.query({
    query: GET_GRANT,
    variables: { id: res.data.mileage_detail.grant_id },
  });
  return {
    props: {
      recorddata: sessionData ? res.data.mileage_detail : [],
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
  recorddata: MileageDetail;
  user_permissions: string[];
  userID: string;
}) {
  const [execReview, setExecReview] = useState(false);
  const {
    is_active,
    id,
    current_user,
    date,
    user_id,
    trip_mileage,
    trip_purpose,
    tolls,
    start_odometer,
    starting_location,
    end_odometer,
    destination,
    parking,
    reimbursement,
    action_history,
    current_status,
    category,
    created_at,
  } = recorddata;
  const router = useRouter();
  const client = createClient(jwt);
  const approveRequest = async (e: any) => {
    const approval_status = StatusHandler({
      user_permissions: user_permissions,
      exec_review: execReview,
    });
    e.preventDefault();
    const res = await client.mutate({
      mutation: APPROVE_MILEAGE,
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
      mutation: REJECT_MILEAGE,
      variables: { request_id: id },
    });
    res.data.reject_request ? router.push("/me/inbox") : null;
  };
  const archiveRequest = async () => {
    const res = await client.mutate({
      mutation: ARCHIVE_MILEAGE,
      variables: { request_id: id },
    });
    res.data.archive_request ? router.push("/me") : null;
  };
  return (
    <main className={styles.main} id={is_active ? `active` : `inactive`}>
      <h1>
        {grant_info.name}{" "}
        <span className={current_status}>
          {category.split("_").join(" ")} Mileage Request
        </span>
      </h1>
      {userID === user_id &&
        (current_status === "REJECTED" || current_status === "PENDING") && (
          <Link href={`/mileage/edit/${id}`}>
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
      <p>
        From {starting_location} to {destination}
      </p>
      <p>{trip_purpose}</p>
      <table>
        <tr>
          <th className="table-cell">Start Odometer</th>
          <td className="table-cell">{start_odometer}</td>
        </tr>
        <tr>
          <th className="table-cell">End Odometer</th>
          <td className="table-cell">{end_odometer}</td>
        </tr>
        <tr>
          <th className="table-cell">Mileage</th>
          <td className="table-cell">{trip_mileage}</td>
        </tr>
        <tr>
          <th className="table-cell">Tolls</th>
          <td className="table-cell">{tolls}</td>
        </tr>
        <tr>
          <th className="table-cell">Parking</th>
          <td className="table-cell">{parking}</td>
        </tr>
        <tr>
          <th className="table-cell">Reimbursement</th>
          <td className="table-cell">{reimbursement.toPrecision(4)}</td>
        </tr>
      </table>
      <h3>Created on {dateFormat(created_at)}</h3>
      <br />
      {userID === user_id && current_status != "ARCHIVED" && (
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
