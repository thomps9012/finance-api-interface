import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import Link from "next/link"
import Image from 'next/image'
import createClient from "../../../graphql/client"
import { Action, CheckDetail, Purchase } from "../../../types/checkrequests"
import dateFormat from "../../../utils/dateformat"
import titleCase from "../../../utils/titlecase"
import { authOptions } from "../../api/auth/[...nextauth]"
import styles from '../../../styles/Home.module.css'
import { gql } from "@apollo/client"

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
    const res = await client.query({ query: CHECK_DETAIL, variables: { id } })
    return {
        props: {
            recorddata: sessionData ? res.data.check_request_detail : []
        }
    }
}

export default function RecordDetail({ recorddata }: { recorddata: CheckDetail }) {
    console.log(recorddata)
    const { id, receipts, purchases, created_at, credit_card, current_status, date, description, grant_id, is_active, order_total, user_id, action_history } = recorddata;
    const vendorName = recorddata.vendor.name;
    const { website, street, city, zip, state } = recorddata.vendor.address;
    return <main className={styles.main} id={is_active ? `active` : `inactive`}>
       {(current_status === 'REJECTED' || current_status === 'PENDING') && <Link href={`/check_request/edit/${id}`}><a>Edit Request</a></Link>}
        <h1 className={current_status}>{titleCase(current_status)} Check Request</h1 >
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
        <h5>Action History</h5>
        {action_history.map((action: Action) => {
            const { id, user, created_at, status } = action;
            return <div key={id}>
                <p>{user.name}</p>
                <p>{titleCase(status)}</p>
                <p>{dateFormat(created_at)}</p>
            </div>
        })}
    </main>
}