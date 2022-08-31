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
    return {
        props: {
            recorddata: sessionData ? res.data.check_request_detail : []
        }
    }
}

export default function RecordDetail({ recorddata, user_role, userID, jwt }: { jwt: string, recorddata: CheckDetail, user_role: string, userID: string }) {
    console.log(recorddata)
    const { id, current_user,receipts, purchases, created_at, credit_card, current_status, date, description, grant_id, is_active, order_total, user_id, action_history } = recorddata;
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
        res.data.archive_request ? router.push('/me/inbox') : null;
    }
    return <main className={styles.main} id={is_active ? `active` : `inactive`}>
       {(current_status === 'REJECTED' || current_status === 'PENDING') && <Link href={`/check_request/edit/${id}`}><a>Edit Request</a></Link>}
       {user_role != 'EMPLOYEE' && current_user === userID && current_status != 'REJECTED' && <div className='button-row'>
            <button onClick={approveRequest}>Approve</button>
            <button onClick={rejectRequest}>Reject</button>
        </div>}
        {(user_role === 'FINANCE' || current_user === user_id) && <button onClick={archiveRequest}>Archive Request</button>}
        <h1 className={current_status}>{current_status} Check Request</h1 >
        <h1>{dateFormat(date)}</h1>
        <h3>{description}</h3>
        <h2>{order_total}</h2>
        {purchases.map((purchase: Purchase) => {
            const { amount, description, grant_line_item } = purchase;
            return <>
                <p>{description}</p>
                <p>{amount}</p>
                <p>{grant_line_item}</p>
            </>
        })}
        <hr />
        <h5>Company Credit Card {credit_card}</h5>
        <hr />
        <h5>Receipts</h5>
        {receipts.map((receipt: string, i: number) => <>
            <Image key={i} src={receipt} height={300} width={300} alt={`receipt ${i}`} />
            <br />
        </>
        )}
        <hr />
        <h3>{vendorName}</h3>
        <p>{website}</p>
        <p>{street}</p>
        <p>{city}</p>
        <p>{state}</p>
        <p>{zip}</p>
        <h3>Grant: {grant_id}</h3>
        <br />
        <Link href={`/user/detail/${user_id}`}><a>Requestor Profile</a></Link>
        <p>Created on {dateFormat(created_at)}</p>
        <h5>Recent Action History</h5>
        {action_history.slice(0,3).map((action: Action) => {
            const { id, user, created_at, status } = action;
            return <div key={id}>
                <p>{user.name}</p>
                <p>{status}</p>
                <p>{dateFormat(created_at)}</p>
            </div>
        })}
    </main>
}