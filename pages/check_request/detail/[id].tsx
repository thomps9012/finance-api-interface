import { NextApiRequest, NextApiResponse } from "next";
import Link from "next/link";
import Image from "next/image";
import createClient from "../../../graphql/client";
import { Action, CheckDetail, Purchase } from "../../../types/checkrequests";
import dateFormat from "../../../utils/dateformat";
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
import ApproveRejectRow from "../../../components/approveRejectBtns";
import { getCookie } from "cookies-next";

export const getServerSideProps = async ({req, res}: {req: NextApiRequest, res: NextApiResponse}) => {
  const { id } = req.query;
  const jwt = getCookie("jwt", {req, res});
  const client = createClient(jwt);
  const tokenData: CustomJWT = await jwtDecode(jwt as string);
  const user_permissions = tokenData.permissions;
  const user_admin = tokenData.admin;
  const userID = tokenData.id;
  const response = await client.query({ query: CHECK_DETAIL, variables: { id } });
  const grant = await client.query({
    query: GET_GRANT,
    variables: { id: response.data.check_request_detail.grant_id },
  });

  return {
    props: {
      recorddata: jwt != undefined ? response.data.check_request_detail : [],
      user_permissions: jwt != undefined ? user_permissions : "",
      userID: jwt != undefined ? userID : "",
      jwt: jwt != undefined ? jwt : "",
      admin: jwt != undefined ? user_admin : false,
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
  admin,
}: {
  grant_info: GrantInfo;
  admin: boolean;
  jwt: string;
  recorddata: CheckDetail;
  user_permissions: string[];
  userID: string;
}) {
  const [execReview, setExecReview] = useState(false);
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
    const selected_permission = (
      document.getElementById("selected_permission") as HTMLSelectElement
    ).value;
    const approval_status = StatusHandler({
      selected_permission: selected_permission,
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
      <h1>{dateFormat(date)}</h1>
      <h1>${order_total}</h1>
      <h1>
        {grant_info.name}{" "}
        <span className={current_status}>
          {category.split("_").join(" ")} Check Request
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
      <p className="req-description">{description}</p>
      <div className={styles.card}>
        <h2>{vendorName}</h2>
        <p>
          {street}, {city}
        </p>
        <p>
          {state}, {zip}
        </p>
        <p>{website}</p>
      </div>
      <h2>Purchases</h2>
      {purchases.map((purchase: Purchase, i: number) => {
        const { amount, description, grant_line_item } = purchase;
        return (
          <div className={styles.card} key={i}>
            <p>
              {grant_line_item} - {description} - ${amount}
            </p>
          </div>
        );
      })}
      <h2>Company Credit Card Used - {credit_card}</h2>
      <h2>Receipts</h2>
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

      <h2>Created on {dateFormat(created_at)}</h2>
      <br />
      <div className="button-row">
        {userID === user_id &&
          (current_status === "REJECTED" || current_status === "PENDING") && (
            <Link href={`/check_request/edit/${id}`}>
              <a className={styles.editLink}>Edit</a>
            </Link>
          )}
        {userID === user_id && current_status != "ARCHIVED" && (
          <a onClick={archiveRequest} className="archive-btn">
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
              const { id, created_at, status } = action;
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
