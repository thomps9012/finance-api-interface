import { GetServerSidePropsContext } from "next"
import { authOptions } from "../../api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth";
import { MileageDetail } from "../../../types/mileage"
import { Action } from "../../../types/checkrequests"
import dateFormat from "../../../utils/dateformat"
import createClient from "../../../graphql/client";
import styles from '../../../styles/Home.module.css'
import { gql } from "@apollo/client";
import Link from "next/link";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";
import { GrantInfo } from "../../../types/grants";
const APPROVE_REQUEST = gql`mutation approveRequest($request_id: ID!, $request_type: String!) {
    approve_request(request_id: $request_id, request_type: $request_type)
  }`;
const REJECT_REQUEST = gql`mutation rejectRequest($request_id: ID!, $request_type: String!) {
    reject_request(request_id: $request_id, request_type: $request_type)
  }`;
const ARCHIVE_REQUEST = gql`mutation archiveRequest($request_id: ID!, $request_type: String!) {
    archive_request(request_id: $request_id, request_type: $request_type)
  }`;
const MILEAGE_DETAIL = gql`query MileageDetail($id: ID!){
    mileage_detail(id: $id) {
      id
      user_id
      grant_id
      date
      starting_location
      destination
      trip_purpose
      start_odometer
      end_odometer
      tolls
      parking
      trip_mileage
      reimbursement
      created_at
      action_history {
        id
        status
        user {
          id
          name
        }
        created_at
      }
      current_user
      current_status
      is_active
    }
  }`;
  const FIND_GRANT = gql`query findGrant($id: ID!) {
    single_grant(id: $id) {
      id
      name
    }
  }`
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { id } = context.query
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token
    const client = createClient(jwt);
    console.log(id)
    const tokenData: { role: string, id: string } = await jwtDecode(jwt as string)
    const user_role = tokenData.role
    const userID = tokenData.id
    const res = await client.query({ query: MILEAGE_DETAIL, variables: { id } })
    const grant = await client.query({ query: FIND_GRANT, variables: {id: res.data.mileage_detail.grant_id} })
    return {
        props: {
            recorddata: sessionData ? res.data.mileage_detail : [],
            user_role: sessionData ? user_role : "",
            userID: sessionData ? userID : "",
            jwt: jwt ? jwt : "",
            grant_info: grant.data.single_grant
        }
    }
}

export default function RecordDetail({ recorddata, user_role, userID, jwt, grant_info }: { grant_info: GrantInfo, jwt: string, recorddata: MileageDetail, user_role: string, userID: string }) {
    const { is_active, id, current_user, date, user_id, trip_mileage, trip_purpose, tolls, start_odometer, starting_location, end_odometer, destination, parking, reimbursement, action_history, current_status } = recorddata;
    const router = useRouter();
    const request_type = 'mileage_requests';
    const client = createClient(jwt);
    const approveRequest = async (e: any) => {
        e.preventDefault();
        const res = await client.mutate({ mutation: APPROVE_REQUEST, variables: { request_type: request_type, request_id: id } })
        res.data.approve_request ? router.push('/me/inbox') : null;
    }
    const rejectRequest = async () => {
        const res = await client.mutate({ mutation: REJECT_REQUEST, variables: { request_type: request_type, request_id: id } })
        res.data.reject_request ? router.push('/me/inbox') : null;
    }
    const archiveRequest = async () => {
        const res = await client.mutate({ mutation: ARCHIVE_REQUEST, variables: { request_type: request_type, request_id: id } })
        res.data.archive_request ? router.push('/me') : null;
    }
    return <main className={styles.main} id={is_active ? `active` : `inactive`}>
        {user_role != 'EMPLOYEE' && current_user === userID && current_status != 'REJECTED' && <div className='button-row'>
            <button onClick={approveRequest}>Approve</button>
            <button onClick={rejectRequest}>Reject</button>
        </div>}
        <h1 className={current_status}>{current_status} Mileage Request</h1>
        <h3>{grant_info.name}</h3>
        <div className="hr" />

        <h2>{dateFormat(date)}</h2>
        <p>From {starting_location} to {destination}</p>
        <p>{trip_purpose}</p>
        <table>
            <tr><th className='table-cell'>Start Odometer</th><td className='table-cell'>{start_odometer}</td></tr>
            <tr><th className='table-cell'>End Odometer</th><td className='table-cell'>{end_odometer}</td></tr>
            <tr><th className='table-cell'>Mileage</th><td className='table-cell'>{trip_mileage}</td></tr>
            <tr><th className='table-cell'>Tolls</th><td className='table-cell'>{tolls}</td></tr>
            <tr><th className='table-cell'>Parking</th><td className='table-cell'>{parking}</td></tr>
            <tr><th className='table-cell'>Reimbursement</th><td className='table-cell'>{(reimbursement).toPrecision(4)}</td></tr>
        </table>
        <br />
        {(current_status === 'REJECTED' || current_status === 'PENDING') && <Link href={`/mileage/edit/${id}`}><a className={styles.editLink}>Edit Request</a></Link>}
        <br />
        {(user_role === 'FINANCE' || userID === user_id) && <button onClick={archiveRequest}>Archive Request</button>}
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
                    return <tr key={id} className={status}>
                        <td className="table-cell">{user.name}</td>
                        <td className="table-cell">{status}</td>
                        <td className="table-cell">{dateFormat(created_at)}</td>
                    </tr>
                })}
            </tbody>
        </table>
    </main>

}