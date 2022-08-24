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
import { useMutation } from "@apollo/client"
import { APPROVE_REQUEST, ARCHIVE_REQUEST, REJECT_REQUEST } from "../../../graphql/mutations"
import { useRouter } from "next/router"
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { id } = context.query
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const client = createClient(sessionData?.Authorization);
    const jwtToken = sessionData?.Authorization;
    const tokenData: { role: string, id: string } = await jwt_decode(jwtToken as string)
    const user_role = tokenData.role
    const userID = tokenData.id
    const res = await client.query({ query: PETTY_CASH_DETAIL, variables: { id } })
    return {
        props: {
            recorddata: sessionData ? res.data.petty_cash_detail : [],
            user_role: sessionData ? user_role : "",
            userID: sessionData ? userID : ""
        }
    }
}

export default function RecordDetail({ recorddata, user_role, userID }: { recorddata: PettyCashDetail, user_role: string, userID: string }) {
    const router = useRouter();
    const { user_id, created_at, current_status, action_history, date, grant_id, current_user, is_active, receipts, amount, description, id } = recorddata;
    const request_type = 'petty_cash_requests';
    const [approve, { data: approveData, error: approveError, loading: approveLoading }] = useMutation(APPROVE_REQUEST)
    const [reject, { data: rejectData, error: rejectError, loading: rejectLoading }] = useMutation(REJECT_REQUEST)
    const [archive, { data: archiveData, error: archiveError, loading: archiveLoading }] = useMutation(ARCHIVE_REQUEST)
    if (approveLoading || rejectLoading || archiveLoading) return 'Submitting...';
    if (approveError || rejectError || archiveError) return `Submission error! ${approveError?.message || rejectError?.message || archiveError?.message}`;
    const approveRequest = async (e: any) => {
        e.preventDefault()
        console.log(id, request_type)
        await approve({ variables: { request_id: id, request_type: request_type } })
        console.log(approveData)
        approveData && router.push('/me')
    }
    const rejectRequest = async (e: any) => {
        e.preventDefault()
        await reject({ variables: { request_id: id, request_type: request_type } })
        console.log(rejectData)
        rejectData && router.push('/me')
    }
    const archiveRequest = async (e: any) => {
        e.preventDefault()
        await archive({ variables: { request_id: id, request_type: request_type } })
        console.log(archiveData)
        archiveData && router.push('/me')
    }
    return <main className={is_active ? 'active' : 'inactive'}>
        {/* {user_role != 'EMPLOYEE' && current_user === userID && <div className='button-row'>
            <button onClick={approveRequest}>Approve</button>
            <button onClick={rejectRequest}>Reject</button>
        </div>}
        {user_role === 'FINANCE' || current_user === user_id && <button onClick={archiveRequest}>Archive Request</button>} */}
        <p>{dateFormat(date)} Petty Cash Request</p>
        <p>for</p>
        <h3>{amount}</h3>
        <h3>{description}</h3>
        <h5>Receipts</h5>
        {receipts.map((receipt: string) => <img src={receipt} key={receipt} />)}
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