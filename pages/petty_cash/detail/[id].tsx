import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import Link from "next/link"
import { Action } from "../../../types/checkrequests"
import { PettyCashDetail } from "../../../types/pettycash"
import dateFormat from "../../../utils/dateformat"
import { authOptions } from "../../api/auth/[...nextauth]"
import createClient from "../../../graphql/client"
import jwt_decode from "jwt-decode";
import { gql } from "@apollo/client"
import { useRouter } from "next/router"
import Image from "next/image"
import styles from '../../../styles/Home.module.css'
import { GrantInfo } from "../../../types/grants"

const APPROVE_REQUEST = gql`mutation approveRequest($request_id: ID!, $request_type: String!) {
    approve_request(request_id: $request_id, request_type: $request_type)
  }`;
const REJECT_REQUEST = gql`mutation rejectRequest($request_id: ID!, $request_type: String!) {
    reject_request(request_id: $request_id, request_type: $request_type)
  }`;
const ARCHIVE_REQUEST = gql`mutation archiveRequest($request_id: ID!, $request_type: String!) {
    archive_request(request_id: $request_id, request_type: $request_type)
  }`;
const PETTY_CASH_DETAIL = gql`query PettyCashDetail($id: ID!){
    petty_cash_detail(id: $id) {
      id
      user_id
      grant_id
      date
      description
      amount
      receipts
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
const FIND_GRANTS = gql`query findGrants {
  all_grants {
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
  const jwt = sessionData?.user.token;
  const client = createClient(jwt);
  const tokenData: { role: string, id: string } = await jwt_decode(jwt as string)
  const user_role = tokenData.role
  const userID = tokenData.id
  const res = await client.query({ query: PETTY_CASH_DETAIL, variables: { id } })
  // move this to an individual query
  const grants = await client.query({ query: FIND_GRANTS })
  const grant_info = grants.data.all_grants.filter((grant: GrantInfo) => grant.id === res.data.petty_cash_detail.grant_id)
  return {
    props: {
      recorddata: sessionData ? res.data.petty_cash_detail : [],
      user_role: sessionData ? user_role : "",
      userID: sessionData ? userID : "",
      jwt: jwt ? jwt : "",
      grant_info: grant_info[0]
    }
  }
}

export default function RecordDetail({ recorddata, user_role, userID, jwt, grant_info }: { grant_info: GrantInfo, jwt: string, recorddata: PettyCashDetail, user_role: string, userID: string }) {
  const router = useRouter();
  const { user_id, created_at, current_status, action_history, date, current_user, is_active, receipts, amount, description, id } = recorddata;
  const request_type = 'petty_cash_requests';
  const client = createClient(jwt);
  const approveRequest = async () => {
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
  return <main className={styles.main} id={is_active ? 'active' : 'inactive'}>
    {user_role != 'EMPLOYEE' && current_user === userID && current_status != 'REJECTED' && <div className='button-row'>
      <button onClick={approveRequest}>Approve</button>
      <button onClick={rejectRequest}>Reject</button>
    </div>}


    <h1 className={current_status}>{current_status} Petty Cash Request</h1>
    <h4>{grant_info.name}</h4>
    <div className="hr" />
    <h3>{dateFormat(date)}</h3>
    <h3>${amount}</h3>
    <p>{description}</p>
    <h4>Receipts</h4>
    {receipts.map((receipt: string, i: number) => <Image key={i} src={receipt} height={300} width={300} alt="" />)}
    <br />
    <h4>Created {dateFormat(created_at)}</h4>
    {(current_status === 'REJECTED' || current_status === 'PENDING') && <Link href={`/petty_cash/edit/${id}`}><a className={styles.editLink}>Edit Request</a></Link>}
    <br />
    {(user_role === 'FINANCE' || userID === user_id) && <button onClick={archiveRequest}>Archive Request</button>}
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