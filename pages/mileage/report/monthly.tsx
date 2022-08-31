import { gql } from '@apollo/client';
import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Link from 'next/link';
import { useState } from 'react';
import createClient from '../../../graphql/client';
import styles from '../../../styles/Home.module.css';
import { MileageDetail, MonthlyMileage } from '../../../types/mileage';
import dateFormat from '../../../utils/dateformat';
import { authOptions } from '../../api/auth/[...nextauth]';

const ORG_MILEAGE_REPORT = gql`query monthlyMileageReport($month: Int!, $year: Int!) {
    mileage_monthly_report(month: $month, year: $year){
        user_id
        name
        month
        year
        mileage
        tolls
        parking
        reimbursement
        requests {
            id
            date
        }
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
    const res = await client.query({ query: ORG_MILEAGE_REPORT, variables: { month: new Date().getMonth(), year: new Date().getFullYear() } })
    return {
        props: {
            base_report: sessionData ? res.data.mileage_monthly_report : null,
            jwt: sessionData?.user.token
        }
    }
}

export default function UserMonthlyMileageReport({ base_report, jwt }: { base_report: MonthlyMileage[], jwt: string }) {
    const [results, setResults] = useState(base_report)
    const client = createClient(jwt);
    const handleChange = async (e: any) => {
        const selectDate = e.target.value.split('-')
        const res = await client.query({ query: ORG_MILEAGE_REPORT, variables: { month: parseInt(selectDate[1]), year: parseInt(selectDate[0]) } })
        setResults(res.data.mileage_monthly_report)
    }
    return <main className={styles.main}>
        <h1>Mileage Reports for <input className={styles.calendar} type='month' defaultValue={Date.now()} onChange={handleChange} /></h1>
        <table>
            <thead>
                    <th className='table-cell'>Employee</th>
                    <th className='table-cell'>Mileage</th>
                    <th className='table-cell'>Tolls</th>
                    <th className='table-cell'>Parking</th>
                    <th className='table-cell'>Total Reimbursement</th>
                    <th className='table-cell'>Request Links</th>
            </thead>
            <tbody>
                {results.map((record: MonthlyMileage) => <tr id='table' key={record.user_id}>
                    <td className='table-cell'><Link href={`/user/${record.user_id}`}>{record.name}</Link></td>
                    <td className='table-cell'>{record.mileage}</td>
                    <td className='table-cell'>{record.tolls}</td>
                    <td className='table-cell'>{record.parking}</td>
                    <td className='table-cell'>{record.reimbursement}</td>
                    <td className='table-cell'>
                        {record.requests.map((request: MileageDetail) => <span key={request.id}><Link href={`/mileage/detail/${request.id}`}>{dateFormat(request.date)}</Link><br /></span>)}
                    </td>
                </tr>
                )}
            </tbody>
        </table>
    </main>
}