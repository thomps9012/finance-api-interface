import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import { useState, useEffect } from "react"
import createClient from "../../../../graphql/client"
import { UserInfo } from "../../../../types/users"
import dateFormat from "../../../../utils/dateformat"
import { authOptions } from "../../../api/auth/[...nextauth]"
import styles from '../../../../styles/Home.module.css';
import { CheckDetail, UserCheckRequests, Vendor } from "../../../../types/checkrequests"
import Link from "next/link"
import jwtDecode from "jwt-decode"
import { ALL_USERS, GET_USER_CHECK_REQUESTS } from "../../../../graphql/queries"
import { CustomJWT } from "../../../../types/next-auth"

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token
    const { id } = context.query
    const decoded_token: CustomJWT = jwtDecode(jwt);
    const userID = decoded_token.id;
    const client = createClient(jwt);
    const start_date = new Date(2018, 0, 1)
    const end_date = new Date()
    const res = await client.query({ query: GET_USER_CHECK_REQUESTS, variables: { id: id != "null" ? id : userID, start_date: start_date, end_date} })
    const users = await client.query({ query: ALL_USERS })
    console.log(res)
    return {
        props: {
            base_report: sessionData ? res.data.user_check_requests : null,
            user_list: sessionData ? users.data.all_users : null,
            userID: id != "null" ? id : userID,
            jwt: jwt ? jwt : ""
        }
    }
}
export default function UserPettyCashReport({ base_report, userID, user_list, jwt }: { jwt: string, user_list: UserInfo[], userID: string, base_report: UserCheckRequests }) {
    const [start_date, setStart] = useState(new Date(2018, 0, 1).toISOString())
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
            const res = await client.query({ query: GET_USER_CHECK_REQUESTS, variables: { id: selectedUserID, start_date: start_date, end_date: end_date } })
            const new_data = res.data.user_check_requests;
            setResults(new_data)
        }
        fetch_data();
    }, [start_date, end_date, selectedUserID, jwt])
    return <main className={styles.main}>
        <h1>User Check Requests Report</h1>
        <div className={styles.inputRow}>
            <div className={styles.inputCol}>
                <h3>Start Date</h3>
                <h3>{dateFormat(start_date)}</h3>
                <hr />
                <input type="date" name="start_date" value={start_date} onChange={handleChange} />
            </div>
            <div className={styles.inputCol}>
                <h3>End Date</h3>
                <h3>{dateFormat(end_date)}</h3>
                <hr />
                <input type="date" name="end_date" value={end_date} onChange={handleChange} />
            </div>
            <div className={styles.inputCol}>
                <h3>Employee Select</h3>
                <hr />
                <select name='selectedUserID' value={selectedUserID} onChange={handleChange}>
                    {user_list.map((user: UserInfo) => <option key={user.id} value={user.id}>{user.name}</option>
                    )}
                </select>
            </div>
        </div>
        {results.total_amount != 0 ? <>
            <h2>Total Amount: ${Math.floor(results.total_amount).toPrecision(4)}</h2>
            <div className="hr" />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {results.vendors?.map((vendor: Vendor) => <div key={vendor.address.website} className={styles.card}>
                    <h2>{vendor.name}</h2>
                    <p>{vendor.address.street}</p>
                    <p>{vendor.address.city}, {vendor.address.state}</p>
                    <p>{vendor.address.website}</p>
                </div>)}
            </div>
            <div className="hr" />
            <table>
                <thead>
                    <th className='table-cell'>Date</th>
                    <th className='table-cell'>Status</th>
                    <th className='table-cell'>Purchases</th>
                    <th className='table-cell'>Total</th>
                </thead>
                <tbody>
                    {results.requests?.map((request: CheckDetail) => {
                        const { id, date, current_status, order_total, purchases } = request;
                        return <Link key={id} href={`/check_request/detail/${id}`}>
                            <tr id='table-row' className={current_status}>
                                <td className='table-cell'>{dateFormat(date)}</td>
                                <td className='table-cell'>{current_status}</td>
                                <td className='table-cell'>{purchases?.length}</td>
                                <td className='table-cell'>${Math.floor(order_total).toPrecision(4)}</td>
                            </tr>
                        </Link>
                    })}
                </tbody>
            </table>
        </>
            : <h2>No Requests during the Time Frame</h2>}
        <hr />

    </main>
}