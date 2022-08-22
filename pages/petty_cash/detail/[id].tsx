import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import Link from "next/link"
import { Action } from "../../../types/checkrequests"
import { PettyCashDetail } from "../../../types/pettycash"
import dateFormat from "../../../utils/dateformat"
import titleCase from "../../../utils/titlecase"
import { authOptions } from "../../api/auth/[...nextauth]"
import createClient from "../../../graphql/client"
import { PETTY_CASH_DETAIL } from "../../../graphql/queries"
import jwt_decode from "jwt-decode";
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { id } = context.query
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const client = await createClient(sessionData?.Authorization);
    const jwtToken = sessionData?.Authorization;
    const tokenData: { role: string } = await jwt_decode(jwtToken as string)
    const user_role = tokenData.role
    const res = await client.query({ query: PETTY_CASH_DETAIL, variables: { id } })
    return {
        props: {
            recorddata: sessionData ? res.data.petty_cash_detail : [],
            user_role: sessionData ? user_role : ""
        }
    }
}

export default function RecordDetail({ recorddata, user_role }: { recorddata: PettyCashDetail, user_role: string }) {
    const { user_id, created_at, current_status, action_history, date, grant_id, is_active, receipts, amount, description } = recorddata;
    return <main className={is_active ? 'active' : 'inactive'}>
        {/* further logic build out for status, employee/manager id etc */}
        {user_role != 'EMPLOYEE' && <div className='button-row'>
            <button>Approve</button>
            <button>Reject</button>
            </div>}
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
            const { id, user, created_at, status } = action;
            return <div key={id}>
                <p>{user.name}</p>
                <p>{created_at}</p>
                <p>{titleCase(status)}</p>
            </div>
        })}
    </main>
}