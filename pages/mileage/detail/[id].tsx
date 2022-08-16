import { GetServerSidePropsContext } from "next"
import { BASE_MILEAGE_API } from "../../../graphql/bases"
import { RECORD_DETAIL } from "../../../graphql/queries"
import { MILEAGE_DETAIL_RES } from "../../../graphql/responses"
import { authOptions } from "../../api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth";
import { MileageDetail } from "../../../types/mileage"
import Link from "next/link"
import { Action } from "../../../types/checkrequests"
import dateFormat from "../../../utils/dateformat"
import titleCase from "../../../utils/titlecase"

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { id } = context.query
    const api = `${BASE_MILEAGE_API}${RECORD_DETAIL}"${id}")${MILEAGE_DETAIL_RES}}`
    const mileagedetail = await fetch(api).then(res => res.json())
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    return {
        props: {
            recorddata: sessionData ? mileagedetail.data.detail : []
        }
    }
}

export default function RecordDetail({ recorddata }: { recorddata: MileageDetail }) {
    const { is_active, created_at, user_id, trip_mileage, trip_purpose, tolls, start_odometer, starting_location, end_odometer, destination, parking, reimbursement, action_history, current_status } = recorddata;
    return <main className={is_active ? 'active' : 'inactive'}>
        <h3>{trip_purpose}</h3>
        <h5>From {starting_location} to {destination}</h5>
        <h5>Trip Breakdown</h5>
        <table>
            <tr><th>Start Odometer</th><th>{start_odometer}</th></tr>
            <tr><th>End Odometer</th><th>{end_odometer}</th></tr>
            <tr><th>Mileage</th><th>{trip_mileage}</th></tr>
            <tr><th>Tolls</th><th>{tolls}</th></tr>
            <tr><th>Parking</th><th>{parking}</th></tr>
            <tr><th>Reimbursement</th><th>{reimbursement}</th></tr>
        </table>
        <hr />
        <Link href={`/user/detail/${user_id}`}><h3>Link to User Profile</h3></Link>
        <p>Created on {dateFormat(created_at)}</p>
        {/* <h5>Current Status: {titleCase(current_status)}</h5> */}
        <h5>Action History</h5>
        {action_history.map((action: Action) => {
            const { id, user_id, created_at, status } = action;
            return <div key={id}>
                <p>{user_id}</p>
                <p>{created_at}</p>
                <p>{titleCase(status)}</p>
            </div>
        })}
    </main>

}