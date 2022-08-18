import AggMileage from "../../components/aggMileage";
import AggCheckRequests from "../../components/aggCheckRequests";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import client from "../../graphql/client";
import { GET_MY_MILEAGE } from "../../graphql/queries";
import { authOptions } from "../api/auth/[...nextauth]";
import { UserOverview } from "../../types/users";
const testUserID = '68125e1f-21c1-4f60-aab0-8efff5dc158e'
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    // update query to user specific
    const res = await client.query({ query: GET_MY_MILEAGE, variables: { id: testUserID }, fetchPolicy: 'no-cache' })
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    console.log(res.data, "userdata on server")
    return {
        props: {
            userdata: sessionData ? res.data.me : []
        }
    }
}


export default function MyMileage({ userdata }: { userdata: UserOverview }) {
    return <AggMileage mileage_requests={userdata.mileage_requests} />
}