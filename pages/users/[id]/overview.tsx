import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { UserOverview } from "../../../types/users";
import dateFormat from "../../../utils/dateformat";
import titleCase from "../../../utils/titlecase";
import { authOptions } from "../../api/auth/[...nextauth]";
import AggMileage from "../../../components/aggMileage";
import AggCheckRequests from "../../../components/aggCheckRequests";
import AggPettyCash from "../../../components/aggPettyCash";
import createClient from "../../../graphql/client";
import styles from '../../../styles/Home.module.css';
import { gql } from "@apollo/client";
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
    const jwt = sessionData?.Authorization
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

    return <main className={styles.main}>
        <h1>Overview for {name}</h1>
        <h2>{titleCase(role)} with {incomplete_action_count} Incomplete Actions</h2>
        <span>Last Login: {dateFormat(last_login)}</span>
        <h3>Mileage Requests</h3>
        <AggMileage mileage_requests={userdata.mileage_requests} />
        <h3>Check Requests</h3>
        <AggCheckRequests check_requests={userdata.check_requests} />
        <h3>Petty Cash Requests</h3>
        <AggPettyCash petty_cash={userdata.petty_cash_requests} />
    </main>
}