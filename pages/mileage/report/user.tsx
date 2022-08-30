import { gql } from '@apollo/client';
import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Link from 'next/link';
import { useState } from 'react';
import createClient from '../../../graphql/client';
import styles from '../../styles/Home.module.css';
import { MonthlyMileage } from '../../../types/mileage';
import { authOptions } from '../../api/auth/[...nextauth]';

// change request ids to requests (similar to cash request returns)
const MILEAGE_REPORT = gql`query userMileageReport($month: Int!, $year: Int!) {
    mileage_monthly_report(month:$month, year:$year){
        user_id
        name
        month
        year
        mileage
        tolls
        parking
        reimbursement
        request_ids
    }
}`;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token
    const client = createClient(jwt);
    const res = await client.query({ query: MILEAGE_REPORT, variables: { month: new Date().getMonth(), year: new Date().getFullYear() } })
    return {
        props: {
            base_report: sessionData ? res.data.mileage_monthly_report : null,
            jwt: sessionData?.user.token
        }
    }
}

export default function UserMonthlyMileageReport({ base_report, jwt }: { base_report: MonthlyMileage[], jwt: string }) {
    const [results, setResults] = useState(base_report)
    console.log(jwt)
    const client = createClient(jwt);
    console.table(base_report)
    const handleChange = async (e: any) => {
        console.log(e.target.value)
        const selectDate = e.target.value.split('-')
        const res = await client.query({ query: MILEAGE_REPORT, variables: { month: selectDate[1], year: selectDate[0] } })
        setResults(res.data.mileage_monthly_report)
    }
    return <main className={styles.main}>
        <h1>User Mileage Reports for <input className={styles.calendar} type='month' defaultValue={Date.now()} onChange={handleChange} /></h1>
        <table>
            <thead>
                <tr>
                    <th>Employee</th>
                    <th>Mileage</th>
                    <th>Tolls</th>
                    <th>Parking</th>
                    <th>Total Reimbursement</th>
                    <th>Request Links</th>
                </tr>
            </thead>
            <tbody>
                {results.map((record: MonthlyMileage) => <tr key={record.user_id}>
                    <td><Link href={`/user/${record.user_id}`}>{record.name}</Link></td>
                    <td>{record.mileage}</td>
                    <td>{record.tolls}</td>
                    <td>{record.parking}</td>
                    <td>{record.reimbursement}</td>
                    <td>
                        {record.request_ids.map((request_id: string) => <span><Link href={`/mileage/detail/${request_id}`}>{request_id}</Link></span>)}
                    </td>
                </tr>
                )}
            </tbody>
        </table>
    </main>
}