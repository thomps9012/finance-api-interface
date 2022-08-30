import { gql } from '@apollo/client';
import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useEffect, useState } from 'react';
import createClient from '../../../graphql/client';
import styles from '../../../styles/Home.module.css';
import { MileageDetail, UserMileage } from '../../../types/mileage';
import { authOptions } from '../../api/auth/[...nextauth]';
import dateFormat from '../../../utils/dateformat';
import titleCase from '../../../utils/titlecase';
import { UserInfo } from '../../../types/users';
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
    const userID = sessionData?.user.id
    const client = createClient(jwt);
    const today = new Date().toISOString();
    const monthAgo = parseInt(today.split('-')[1]) - 1;
    const monthString = monthAgo > 9 ? monthAgo : '0' + monthAgo
    const startDate = today.split('-')[0] + '-' + monthString + '-' + today.split('-')[2]
    const res = await client.query({ query: MILEAGE_REPORT, variables: { user_id: userID, start_date: startDate, end_date: today } })
    const users = await client.query({ query: USER_LIST })
    console.log(res)
    return {
        props: {
            base_report: sessionData ? res.data.user_mileage : null,
            user_list: sessionData ? users.data.all_users : null,
            userID: userID ? userID : "",
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
        {results.reimbursement != 0 ? <>
            <h2>Total Reimbursement: ${results.reimbursement}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 5, padding: 5 }}>Mileage: {results.mileage}</h2>
                <h2 style={{ margin: 5, padding: 5 }}>Tolls: {results.tolls}</h2>
                <h2 style={{ margin: 5, padding: 5 }}>Parking: {results.parking}</h2>
            </div>
            <hr />
            <h2>Requests</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {results.requests?.map((request: MileageDetail) => <div key={request.id}>
                    <p style={{ margin: 5, padding: 5 }} className={request.current_status}>{titleCase(request.current_status)} {dateFormat(request.date)}</p>
                </div>
                )}
            </div>
        </>
            : <h2>No Requests during the Time Frame</h2>}
        <hr />
    </main>
}