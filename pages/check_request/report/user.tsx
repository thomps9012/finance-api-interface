import { gql } from "@apollo/client"
import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import { useState, useEffect } from "react"
import createClient from "../../../graphql/client"
import { UserInfo } from "../../../types/users"
import dateFormat from "../../../utils/dateformat"
import titleCase from "../../../utils/titlecase"
import { authOptions } from "../../api/auth/[...nextauth]"
import styles from '../../../styles/Home.module.css';
import { CheckDetail, UserCheckRequests, Vendor } from "../../../types/checkrequests"
import Link from "next/link"
const USER_CHECK_REPORT = gql`query userCheckRequests($user_id: ID!, $start_date: String!, $end_date: String!) {
    user_check_requests(id: $user_id, start_date: $start_date, end_date: $end_date){
        total_amount
        vendors {
            name
            address {
                street
                city
                state
                website
            }
        }
        requests {
            id
            created_at
            date
            current_status
            order_total
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
    const userID = sessionData?.user.id;
    const client = createClient(jwt);
    const today = new Date().toISOString();
    const monthAgo = parseInt(today.split('-')[1]) - 1;
    const monthString = monthAgo > 9 ? monthAgo : '0' + monthAgo
    const startDate = today.split('-')[0] + '-' + monthString + '-' + today.split('-')[2]
    const res = await client.query({ query: USER_CHECK_REPORT, variables: { user_id: userID, start_date: startDate, end_date: today } })
    const users = await client.query({ query: USER_LIST })
    console.log(res)
    return {
        props: {
            base_report: sessionData ? res.data.user_check_requests : null,
            user_list: sessionData ? users.data.all_users : null,
            userID: userID ? userID : "",
            jwt: jwt ? jwt : ""
        }
    }
}
export default function UserPettyCashReport({ base_report, userID, user_list, jwt }: { jwt: string, user_list: UserInfo[], userID: string, base_report: UserCheckRequests }) {
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
            const res = await client.query({ query: USER_CHECK_REPORT, variables: { user_id: selectedUserID, start_date: start_date, end_date: end_date } })
            const new_data = res.data.user_check_requests;
            setResults(new_data)
        }
        fetch_data();
    }, [start_date, end_date, selectedUserID, jwt])
    return <main className={styles.main}>
        <h1>User Petty Cash Reports</h1>

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
        <hr />
        {results.total_amount != 0 ? <>
            <h2>Total Amount: {results.total_amount}</h2>
            <h2>Vendors Used</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {results.vendors?.map((vendor: Vendor) => <div key={vendor.name} style={{ margin: 5, padding: 5 }}>
                    <h5>{vendor.name}</h5>
                    <p>{vendor.address.street}</p>
                    <p>{vendor.address.city}, {vendor.address.state}</p>
                    <p>{vendor.address.website}</p>
                </div>)}
            </div>
            <h1>Requests</h1>
        <table>
            <thead>
                <th>Link</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
            </thead>
            <tbody>
                {results.requests.map((request: CheckDetail) => {
                    const { id, date, current_status, order_total } = request;
                    return <tr key={id} className={current_status}>
                        <td><Link href={`/check_request/detail/${id}`}><a>Detail</a></Link></td>
                        <td>{dateFormat(date)}</td>
                        <td>{current_status}</td>
                        <td>${order_total}</td>
                    </tr>
                })}
            </tbody>
        </table>
        </>
            : <h2>No Requests during the Time Frame</h2>}
        <hr />

    </main>
}