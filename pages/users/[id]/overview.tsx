import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { UserOverview } from "../../../types/users";
import dateFormat from "../../../utils/dateformat";
import { authOptions } from "../../api/auth/[...nextauth]";
import createClient from "../../../graphql/client";
import styles from '../../../styles/Home.module.css';
import { gql } from "@apollo/client";
import Link from "next/link";
const USER_OVERVIEW = gql`query UserOverview($id: ID!) {
    user_overview(id:$id) {
        id
        manager_id
        name
        role
        last_login
        incomplete_action_count
        mileage_requests {
            mileage
            parking
            tolls
            requests {
            id
            current_status
            date
            }
            reimbursement
        }
        check_requests {
            vendors {
            name
            }
            requests {
            id
            current_status
            date
            }
            total_amount
        }
        petty_cash_requests {
            requests {
            id
            current_status
            date
            }
            total_amount
        }
    }
}`;
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { id } = context.query
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token
    const client = createClient(jwt);
    const res = await client.query({ query: USER_OVERVIEW, variables: { id } })
    console.log(res.data, 'user overview')
    return {
        props: {
            userdata: sessionData ? res.data.user_overview : []
        }
    }
}


export default function UserRecordOverview({ userdata }: { userdata: UserOverview }) {
    const { name, id, incomplete_action_count, last_login, role } = userdata;

    return <main className={styles.container}>
        <h1>Data for {name}</h1>
        {/* <h1>Data for {name} <Link href={`/users/${userdata.id}/edit`}><a>✏️</a></Link></h1> */}
        <h3 style={{color: 'cadetblue'}}>{role} with {incomplete_action_count} Incomplete Actions</h3>
        <h3 style={{color: 'cadetblue'}}>Last Login: {dateFormat(last_login)}</h3>
        <h2>Recent Requests</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ flexDirection: 'column' }}>
                <Link href={`/mileage/report/user/${id}`}><h3>Mileage</h3></Link>
                {userdata.mileage_requests.requests.length > 0 ?
                    userdata.mileage_requests.requests.slice(0, 3).map((mileage_req: any) => <div key={mileage_req.id}>
                        <Link href={`/mileage/detail/${mileage_req.id}`}><a><p className={mileage_req.current_status}>{dateFormat(mileage_req.date)} {mileage_req.current_status}</p></a></Link>
                    </div>
                    ) : <p className="ARCHIVED">None</p>}
            </div>
            <div style={{ flexDirection: 'column' }}>
                <Link href={`/check_request/report/user/${id}`}><h3>Check</h3></Link>
                {userdata.check_requests.requests.length > 0 ?
                    userdata.check_requests.requests.slice(0, 3).map((check_req: any) => <div key={check_req.id}>

                        <Link href={`/check_request/detail/${check_req.id}`}><a><p className={check_req.current_status}>{dateFormat(check_req.date)} {check_req.current_status}</p></a></Link>
                    </div>
                    ) : <p className="ARCHIVED">None</p>}
            </div>
            <div style={{ flexDirection: 'column' }}>
                <Link href={`/petty_cash/report/user/${id}`}><h3>Petty Cash</h3></Link>
                {userdata.petty_cash_requests.requests.length > 0 ?
                    userdata.petty_cash_requests.requests.slice(0, 3).map((petty_cash_req: any) => <div key={petty_cash_req.id}>
                        <Link href={`/petty_cash/detail/${petty_cash_req.id}`}><a><p className={petty_cash_req.current_status}>{dateFormat(petty_cash_req.date)} {petty_cash_req.current_status}</p></a></Link>
                    </div>
                    ) : <p className="ARCHIVED">None</p>}
            </div>
        </div>
    </main>
}