import { gql } from '@apollo/client';
import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useEffect, useState } from 'react';
import createClient from '../../../../graphql/client';
import styles from '../../../../styles/Home.module.css';
import { MileageDetail, UserMileage } from '../../../../types/mileage';
import { authOptions } from '../../../api/auth/[...nextauth]';
import dateFormat from '../../../../utils/dateformat';
import { UserInfo } from '../../../../types/users';
import Link from 'next/link';
import jwtDecode from 'jwt-decode';
// possible conflict on backend
const MILEAGE_REPORT = gql`query userMileageReport($start_date: String, $end_date: String, $user_id: ID!) {
    user_mileage(start_date: $start_date, end_date: $end_date, id: $user_id){
        user {
            id
            name
        }
        mileage
        tolls
        parking
        reimbursement
        requests {
            id
            date
            current_status
            reimbursement
            trip_mileage
        }
    }
}`;

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
    const userID = userData.id
    const { id } = context.query
    const client = createClient(jwt);
    const today = new Date().toISOString();
    const monthAgo = parseInt(today.split('-')[1]) - 1;
    const monthString = monthAgo > 9 ? monthAgo : '0' + monthAgo
    const startDate = today.split('-')[0] + '-' + monthString + '-' + today.split('-')[2]
    const res = await client.query({ query: MILEAGE_REPORT, variables: { user_id: id != "null" ? id : userID, start_date: startDate, end_date: today } })
    const users = await client.query({ query: USER_LIST })
    console.log(res)
    return {
        props: {
            base_report: sessionData ? res.data.user_mileage : null,
            user_list: sessionData ? users.data.all_users : null,
            userID: id != "null" ? id : userID,
            jwt: jwt ? jwt : ""
        }
    }
}

export default function UserMonthlyMileageReport({ base_report, userID, jwt, user_list }: { userID: string, base_report: UserMileage, user_list: UserInfo[], jwt: string }) {
    const [start_date, setStart] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString())
    const [end_date, setEnd] = useState(new Date().toISOString())
    const [selectedUserID, setSelectedUserID] = useState(userID)
    const [results, setResults] = useState(base_report)
    console.table(results)
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
            const res = await client.query({ query: MILEAGE_REPORT, variables: { user_id: selectedUserID, start_date: start_date, end_date: end_date } })
            const new_data = res.data.user_mileage;
            setResults(new_data)
        }
        fetch_data();
    }, [start_date, end_date, selectedUserID, jwt])
    return <main className={styles.main}>
        <h1>User Mileage Report</h1>
        <div className={styles.inputRow}>
            <div className={styles.inputCol}>
                <h3>Start Date</h3>
                <hr />
                <h3>{dateFormat(start_date)}</h3>
                <input type="date" name="start_date" value={start_date} onChange={handleChange} />
            </div>
            <div className={styles.inputCol}>
                <h3>End Date</h3>
                <hr />
                <h3>{dateFormat(end_date)}</h3>
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
        <div className="hr" />
        {results.reimbursement != 0 ? <>
            <table>
                <tr><th className='table-cell'>Total Reimbursement</th><td className='table-cell'>${Math.floor(results.reimbursement).toPrecision(4)}</td><th className='table-cell'>Total Mileage</th><td className='table-cell'>{results.mileage}</td></tr>
                <tr><th className='table-cell'>Total Tolls</th><td className='table-cell'>{results.tolls}</td><th className='table-cell'>Total Parking</th><td className='table-cell'>{results.parking}</td></tr>
            </table>
            <div className="hr" />
            <table>
                <thead>
                    <th className='table-cell'>Date</th>
                    <th className='table-cell'>Status</th>
                    <th className='table-cell'>Mileage</th>
                    <th className='table-cell'>Reimbursement</th>
                </thead>
                <tbody>
                    {results.requests.map((request: MileageDetail) => {
                        const { id, date, current_status, trip_mileage, reimbursement } = request;
                        return <Link key={id} href={`/mileage/detail/${id}`}>
                            <tr id='table-row' className={current_status}>
                                <td className='table-cell'>{dateFormat(date)}</td>
                                <td className='table-cell'>{current_status}</td>
                                <td className='table-cell'>{trip_mileage}</td>
                                <td className='table-cell'>${Math.floor(reimbursement).toPrecision(4)}</td>
                            </tr>
                        </Link>
                    }
                    )}
                </tbody>
            </table>
        </>
            : <h2>No Requests during the Time Frame</h2>}
        <hr />
    </main>
}