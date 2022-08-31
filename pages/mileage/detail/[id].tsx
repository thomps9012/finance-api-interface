import { GetServerSidePropsContext } from "next"
import { authOptions } from "../../api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth";
import { MileageDetail } from "../../../types/mileage"
import { Action } from "../../../types/checkrequests"
import dateFormat from "../../../utils/dateformat"
import titleCase from "../../../utils/titlecase"
import createClient from "../../../graphql/client";
import styles from '../../../styles/Home.module.css'
import { gql } from "@apollo/client";
import Link from "next/link";
// need to move all gql queries to individual pages
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
    const res = await client.query({ query: MILEAGE_DETAIL, variables: { id } })
    return {
        props: {
            recorddata: sessionData ? res.data.mileage_detail : []
        }
    }
}

export default function RecordDetail({ recorddata }: { recorddata: MileageDetail }) {
    const { is_active, id, date, user_id, trip_mileage, trip_purpose, tolls, start_odometer, starting_location, end_odometer, destination, parking, reimbursement, action_history, current_status } = recorddata;
    return <main className={styles.main} id={is_active ? `active` : `inactive`}>
        {current_status === 'REJECTED' || current_status === 'PENDING' && <Link href={`/mileage/edit/${id}`}><a>Edit Request</a></Link>}
        <h2>{dateFormat(date)}</h2>
        <h1 className={current_status}>Trip from</h1>
        <h1 className={current_status}> {starting_location} to {destination}</h1>
        <h3>Grant: {recorddata.grant_id}</h3>
        <Link href={`/user/detail/${user_id}`}><a>Requestor Profile</a></Link>
        <h3>{trip_purpose}</h3>
        <table>
            <tr><th>Start Odometer</th><th>{start_odometer}</th></tr>
            <tr><th>End Odometer</th><th>{end_odometer}</th></tr>
            <tr><th>Mileage</th><th>{trip_mileage}</th></tr>
            <tr><th>Tolls</th><th>{tolls}</th></tr>
            <tr><th>Parking</th><th>{parking}</th></tr>
            <tr><th>Reimbursement</th><th>{reimbursement}</th></tr>
        </table>
        <hr />

        {/* <h5>Current Status: {titleCase(current_status)}</h5> */}
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