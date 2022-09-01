import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import Link from "next/link"
import Image from 'next/image'
import createClient from "../../../graphql/client"
import { Action, CheckDetail, Purchase } from "../../../types/checkrequests"
import dateFormat from "../../../utils/dateformat"
import { authOptions } from "../../api/auth/[...nextauth]"
import styles from '../../../styles/Home.module.css'
import { gql } from "@apollo/client"
import { useRouter } from "next/router"
import jwtDecode from "jwt-decode"
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
const CHECK_DETAIL = gql`query checkDetail($id: ID!){
    check_request_detail(id: $id) {
      id
      user_id
      grant_id
      date
      vendor {
        name
        address {
          website
          street
          city
          state
          zip
        }
      }
      description
      purchases {
        amount
        description
        grant_line_item
      }
      receipts
      order_total
      credit_card
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
  const tokenData: { role: string, id: string } = await jwtDecode(jwt as string)
  const user_role = tokenData.role
  const userID = tokenData.id
  const res = await client.query({ query: CHECK_DETAIL, variables: { id } })
  const grant = await client.query({ query: FIND_GRANT, variables: {id: res.data.check_request_detail.grant_id} })
  return {
    props: {
      recorddata: sessionData ? res.data.check_request_detail : [],
      user_role: sessionData ? user_role : "",
      userID: sessionData ? userID : "",
      jwt: jwt ? jwt : "",
      grant_info: grant.data.single_grant
    }
  }
}

export default function RecordDetail({ recorddata, user_role, userID, jwt, grant_info }: { grant_info: GrantInfo, jwt: string, recorddata: CheckDetail, user_role: string, userID: string }) {
  console.log(recorddata)
  const { id, current_user, receipts, purchases, created_at, credit_card, current_status, date, description, grant_id, is_active, order_total, user_id, action_history } = recorddata;
  const vendorName = recorddata.vendor.name;
  const router = useRouter();
  const request_type = 'check_requests';
  const { website, street, city, zip, state } = recorddata.vendor.address;
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
    <h1 className={current_status}>{current_status} Check Request</h1 >
    <h3>{grant_info.name}</h3>
    <div className="hr" />
    <h2>{dateFormat(date)}</h2>
    <h2>${order_total.toPrecision(4)}</h2>
    <p>{description}</p>
    <h3>Purchases</h3>
    {purchases.map((purchase: Purchase, i: number) => {
      const { amount, description, grant_line_item } = purchase;
      return <div className={styles.card} key={i}>
        <p>{grant_line_item}</p>
        <p>{description}</p>
        <p>${amount}</p>
      </div>
    })}
    <h3>Company Credit Card: {credit_card}</h3>
    <h3>Receipts</h3>
    {receipts.map((receipt: string, i: number) => <>
      <Image key={i} src={receipt} height={300} width={300} alt={`receipt ${i}`} />
      <br />
    </>
    )}
    <div className={styles.card}>
      <h2>{vendorName}</h2>
      <p>{website}</p>
      <p>{street}</p>
      <p>{city}</p>
      <p>{state}</p>
      <p>{zip}</p>
    </div>
    <h3>Created on {dateFormat(created_at)}</h3>
    {(current_status === 'REJECTED' || current_status === 'PENDING') && <Link href={`/check_request/edit/${id}`}><a className={styles.editLink}>Edit Request</a></Link>}
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