import { gql } from "@apollo/client"
import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import { useState, useEffect } from "react"
import createClient from "../../../../graphql/client"
import { UserPettyCash, PettyCashDetail } from "../../../../types/pettycash"
import { UserInfo } from "../../../../types/users"
import dateFormat from "../../../../utils/dateformat"
import { authOptions } from "../../../api/auth/[...nextauth]"
import styles from '../../../../styles/Home.module.css';
import Link from "next/link"
import jwtDecode from "jwt-decode"
const USER_PETTY_CASH_REPORT = gql`query userPettyCash($user_id: ID!, $start_date: String!, $end_date: String!) {
    petty_cash_user_requests(user_id: $user_id, start_date: $start_date, end_date: $end_date){
        total_amount
        requests {
            id
            created_at
            date
            current_status
            amount
        }
    }
}`
const USER_LIST = gql`query getUsers {
    all_users {
        id
        name
        role
    }
}`
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token
    const userData: { id: string } = jwtDecode(jwt)
    const userID = userData.id;
    const { id } = context.query;
    const client = createClient(jwt);
    const today = new Date().toISOString();
    const monthAgo = parseInt(today.split('-')[1]) - 1;
    const monthString = monthAgo > 9 ? monthAgo : '0' + monthAgo
    const startDate = today.split('-')[0] + '-' + monthString + '-' + today.split('-')[2]
    const res = await client.query({ query: USER_PETTY_CASH_REPORT, variables: { user_id: id != "null" ? id : userID, start_date: startDate, end_date: today } })
    const users = await client.query({ query: USER_LIST })
    console.log(res)
    return {
        props: {
            base_report: sessionData ? res.data.petty_cash_user_requests : null,
            user_list: sessionData ? users.data.all_users : null,
            userID: id != "null" ? id : userID,
            jwt: jwt ? jwt : ""
        }
    }
}
export default function UserPettyCashReport({ base_report, userID, user_list, jwt }: { jwt: string, user_list: UserInfo[], userID: string, base_report: UserPettyCash }) {
    const [start_date, setStart] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString())
    const [end_date, setEnd] = useState(new Date().toISOString())
    const [selectedUserID, setSelectedUserID] = useState(userID)
    const [results, setResults] = useState(base_report)
    const handleChange = async (e: any) => {
        const { name, value } = e.target;
        switch (name) {
            case 'start_date':
                setStart(new Date(value).toISOString())
                break;
            case 'end_date':
                setEnd(new Date(value).toISOString())
                break;
            case 'selectedUserID':
                setSelectedUserID(value);
                break;
        }
    }
    useEffect(() => {
        const fetch_data = async () => {
            const client = createClient(jwt);
            const res = await client.query({ query: USER_PETTY_CASH_REPORT, variables: { user_id: selectedUserID, start_date: start_date, end_date: end_date } })
            const new_data = res.data.petty_cash_user_requests;
            setResults(new_data)
        }
        fetch_data();
    }, [start_date, end_date, selectedUserID, jwt])
    return <main className={styles.main}>
        <h1>User Petty Cash Report</h1>
        <div className={styles.inputRow}>
            <div className={styles.inputCol}>
                <h5>Start Date</h5>
                <hr />
                <h5>{dateFormat(start_date)}</h5>
                <input type="date" name="start_date" value={start_date} onChange={handleChange} />
            </div>
            <div className={styles.inputCol}>
                <h5>End Date</h5>
                <hr />
                <h5>{dateFormat(end_date)}</h5>
                <input type="date" name="end_date" value={end_date} onChange={handleChange} />
            </div>
            <div className={styles.inputCol}>
                <h5>Employee Select</h5>
                <hr />
                <select name='selectedUserID' value={selectedUserID} onChange={handleChange}>
                    {user_list.map((user: UserInfo) => <option key={user.id} value={user.id}>{user.name}</option>
                    )}
                </select>
            </div>
        </div>
        <div className="hr" />
        {results.total_amount != 0 ? <>
            <h2>Total Amount: ${Math.floor(results.total_amount).toPrecision(4)}</h2>
            <table>
                <thead>
                    <th className='table-cell'>Link</th>
                    <th className='table-cell'>Status</th>
                    <th className='table-cell'>Date</th>
                    <th className='table-cell'>Amount</th>
                </thead>
                <tbody>
                    {results.requests?.map((request: PettyCashDetail) => <tr id='table-row' key={request.id} className={request.current_status}>
                        <td className='table-cell'><Link href={`/petty_cash/detail/${request.id}`}><a>Detail</a></Link></td>
                        <td className='table-cell'>{request.current_status}</td>
                        <td className='table-cell'> {dateFormat(request.date)}</td>
                        <td className='table-cell'>${Math.floor(request.amount).toPrecision(4)}</td>
                    </tr>
                    )}
                </tbody>
            </table>
        </>
            : <h2>No Requests during the Time Frame</h2>
        }
        <hr />

    </main >
}