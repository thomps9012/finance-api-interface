import { gql } from '@apollo/client';
import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useEffect, useState } from 'react';
import createClient from '../../../graphql/client';
import styles from '../../styles/Home.module.css';
import { MileageDetail } from '../../../types/mileage';
import { authOptions } from '../../api/auth/[...nextauth]';
import { GrantInfo, GrantMileage } from '../../../types/grants';
import dateFormat from '../../../utils/dateformat';
import titleCase from '../../../utils/titlecase';
// need to build out on backend
const MILEAGE_REPORT = gql`query grantMileageReport($start_date: String!, $end_date: String!, $grant_id: ID!) {
    grant_mileage_report(start_date: $start_date, end_date: $end_date, grant_id: $grant_id){
        grant {
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
        }
    }
}`;

// need to build out query for backend
const GRANT_LIST = gql`query getGrants {
    all_grants {
        id
        name
    }
}`

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token
    const grantID = "H79TI082369"
    const client = createClient(jwt);
    const today = new Date().toISOString();
    const monthAgo = parseInt(today.split('-')[1]) - 1;
    const monthString = monthAgo > 9 ? monthAgo : '0' + monthAgo
    const startDate = today.split('-')[0] + '-' + monthString + '-' + today.split('-')[2]
    const res = await client.query({ query: MILEAGE_REPORT, variables: { grant_id: grantID, start_date: startDate, end_date: today } })
    const grants = await client.query({ query: GRANT_LIST })
    console.log(res)
    return {
        props: {
            base_report: sessionData ? res.data.grant_mileage_report : null,
            grant_list: sessionData ? grants.data.all_grants : null,
            jwt: jwt ? jwt : ""
        }
    }
}

export default function UserMonthlyMileageReport({ base_report, jwt, grant_list }: { base_report: GrantMileage, grant_list: GrantInfo[], jwt: string }) {
    const [start_date, setStart] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString())
    const [end_date, setEnd] = useState(new Date().toISOString())
    const [selectedGrant, setSelectedGrant] = useState("H79TI082369")
    const [results, setResults] = useState(base_report)
    const client = createClient(jwt);
    const handleChange = async (e: any) => {
        const { name, value } = e.target;
        switch (name) {
            case 'start_date':
                setStart(new Date(value).toISOString())
                break;
            case 'end_date':
                setEnd(new Date(value).toISOString())
                break;
            case 'selectedGrant':
                setSelectedGrant(value);
                break;
        }
    }
    useEffect(() => {
        const fetch_data = async () => {
            const res = await client.query({ query: MILEAGE_REPORT, variables: { grant_id: selectedGrant, start_date: start_date, end_date: end_date } })
            const new_data = res.data.petty_cash_user_requests;
            setResults(new_data)
        }
        fetch_data();
    }, [start_date, end_date, selectedGrant])
    return <main className={styles.main}>
        <h1>Grant Mileage Report</h1>
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
                <h5>Grant Select</h5>
                <hr />
                <select name='selectedUserID' value={selectedGrant} onChange={handleChange}>
                    {grant_list.map((grant: GrantInfo) => <option key={grant.id} value={grant.id}>{grant.name}</option>
                    )}
                </select>
            </div>
        </div>
        <hr />
        {results.reimbursement != 0 ? <>
            <h2>Request List</h2>
            {results.requests?.map((request: MileageDetail) => <div key={request.id}>
                <p className={request.current_status}>{titleCase(request.current_status)} {dateFormat(request.date)}</p>
            </div>
            )}
        </>
            : <h2>No Requests during the Time Frame</h2>}
        <hr />
    </main>
}