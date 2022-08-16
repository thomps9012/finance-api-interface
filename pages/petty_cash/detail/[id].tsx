import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import Link from "next/link"
import { BASE_PETTY_CASH_API } from "../../../graphql/bases"
import { RECORD_DETAIL } from "../../../graphql/queries"
import { PETTY_CASH_DETAIL_RES } from "../../../graphql/responses"
import { Action } from "../../../types/checkrequests"
import { PettyCashDetail } from "../../../types/pettycash"
import dateFormat from "../../../utils/dateformat"
import titleCase from "../../../utils/titlecase"
import { authOptions } from "../../api/auth/[...nextauth]"

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { id } = context.query
    const api = `${BASE_PETTY_CASH_API}${RECORD_DETAIL}"${id}")${PETTY_CASH_DETAIL_RES}}`
    const pettycashdetail = await fetch(api).then(res => res.json())
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    return {
        props: {
            recorddata: sessionData ? pettycashdetail.data.detail : []
        }
    }
}

export default function RecordDetail({ recorddata }: { recorddata: PettyCashDetail }) {
    console.log(recorddata)
    const { user_id, created_at, current_status, action_history, date, grant_id, is_active, receipts, amount, description } = recorddata;
    return <main className={is_active ? 'active' : 'inactive'}>
        <p>{dateFormat(date)} Petty Cash Request</p>
        <p>for</p>
        <h3>{amount}</h3>
        <h3>{description}</h3>
        <h5>Receipts</h5>
        {receipts.map((receipt: string) => <img src={receipt} />)}
        <hr />
        <h3>Links to User and Grant Pages</h3>
        <Link href={`/user/detail/${grant_id}`}><a>{grant_id}</a></Link>
        <br />
        <Link href={`/user/detail/${user_id}`}><a>User Profile</a></Link>
        <p>Created on {dateFormat(created_at)}</p>
        <h5>Current Status: {titleCase(current_status)}</h5>
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