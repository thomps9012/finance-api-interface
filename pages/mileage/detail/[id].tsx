import { NextApiRequest, NextApiResponse } from "next";
import { MileageDetail } from "../../../types/mileage";
import { Action } from "../../../types/checkrequests";
import dateFormat from "../../../utils/dateformat";
import createClient from "../../../graphql/client";
import styles from "../../../styles/Home.module.css";
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
import ApproveRejectRow from "../../../components/approveRejectBtns";
import { getCookie } from "cookies-next";

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const { id } = req.query;
  const jwt = getCookie("jwt", { req, res });
  const client = createClient(jwt);
  const tokenData: CustomJWT = await jwtDecode(jwt as string);
  const user_permissions = tokenData.permissions;
  const user_admin = tokenData.admin;
  const userID = tokenData.id;
  const response = await client.query({ query: MILEAGE_DETAIL, variables: { id } });
  const grant = await client.query({
    query: GET_GRANT,
    variables: { id: response.data.mileage_detail.grant_id },
  });
  return {
    props: {
      recorddata: jwt != undefined ? response.data.mileage_detail : [],
      user_permissions: jwt != undefined ? user_permissions : "",
      userID: jwt != undefined ? userID : "",
      jwt: jwt ? jwt : "",
      grant_info: grant.data.single_grant,
      admin: jwt != undefined ? user_admin : false,
    },
  };
};

export default function RecordDetail({
  recorddata,
  user_permissions,
  userID,
  jwt,
  grant_info,
  admin,
}: {
  grant_info: GrantInfo;
  admin: boolean;
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
    const selected_permission = (
      document.getElementById("selected_permission") as HTMLSelectElement
    ).value;
    const approval_status = StatusHandler({
      selected_permission: selected_permission,
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
      <h1>{dateFormat(date)}</h1>
      <h1>
        {grant_info.name}{" "}
        <span className={current_status}>
          {category.split("_").join(" ")} Mileage Request
        </span>
      </h1>

      {admin && current_user === userID && current_status != "REJECTED" && (
        <ApproveRejectRow
          user_permissions={user_permissions}
          execReview={execReview}
          setExecReview={setExecReview}
          approveRequest={approveRequest}
          rejectRequest={rejectRequest}
        />
      )}
      <div className="hr" />

      <p className="req-description">
        From {starting_location} to {destination}
      </p>
      <p className="req-description">{trip_purpose}</p>
      <table>
        <tr>
          <th className="table-cell">
            <h2>Start Odometer</h2>
          </th>
          <td className="req-description">{start_odometer}</td>
        </tr>
        <tr>
          <th className="table-cell">
            <h2>End Odometer</h2>
          </th>
          <td className="req-description">{end_odometer}</td>
        </tr>
        <tr>
          <th className="table-cell">
            <h2>Mileage</h2>
          </th>
          <td className="req-description">{trip_mileage}</td>
        </tr>
        <tr>
          <th className="table-cell">
            <h2>Tolls</h2>
          </th>
          <td className="req-description">{tolls}</td>
        </tr>
        <tr>
          <th className="table-cell">
            <h2>Parking</h2>
          </th>
          <td className="req-description">{parking}</td>
        </tr>
        <tr>
          <th className="table-cell">
            <h2>Reimbursement</h2>
          </th>
          <td className="req-description">{reimbursement.toPrecision(4)}</td>
        </tr>
      </table>
      <h2>Created on {dateFormat(created_at)}</h2>
      <br />
      <div className="button-row">
        {userID === user_id &&
          (current_status === "REJECTED" || current_status === "PENDING") && (
            <Link href={`/mileage/edit/${id}`}>
              <a className={styles.editLink}>Edit</a>
            </Link>
          )}
        {userID === user_id && current_status != "ARCHIVED" && (
          <a className="archive-btn" onClick={archiveRequest}>
            Archive
          </a>
        )}
      </div>
      <div className="hr" />
      <h2>Recent Actions</h2>
      <table>
        <tbody>
          {action_history
            .slice(0, 3)
            .sort((a, b) => -1)
            .map((action: Action) => {
              const { id, user, created_at, status } = action;
              return (
                <tr key={id} className={status}>
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
