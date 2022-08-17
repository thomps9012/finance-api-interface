import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { UserOverview } from "../../../types/users";
import dateFormat from "../../../utils/dateformat";
import titleCase from "../../../utils/titlecase";
import { authOptions } from "../../api/auth/[...nextauth]";
import AggMileage from "../../../components/aggMileage";
import AggCheckRequests from "../../../components/aggCheckRequests";
import AggPettyCash from "../../../components/aggPettyCash";
import USER_API from "../../../API/user";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { id } = context.query
    const useroverview = await USER_API.getOverview(id as string)
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    return {
        props: {
            userdata: sessionData ? useroverview.data.overview : []
        }
    }
}


export default function UserRecordOverview({ userdata }: { userdata: UserOverview }) {
    const { name, id, incomplete_action_count, last_login, role } = userdata;

    return <div>
        <h1>Overview for {name}</h1>
        <h2>{titleCase(role)} with {incomplete_action_count} Incomplete Actions</h2>
        <span>Last Login: {dateFormat(last_login)}</span>
        <h3>Mileage Requests</h3>
        <AggMileage mileage_requests={userdata.mileage_requests} />
        <h3>Check Requests</h3>
        <AggCheckRequests check_requests={userdata.check_requests} />
        <h3>Petty Cash Requests</h3>
        <AggPettyCash petty_cash={userdata.petty_cash_requests} />
    </div>
}