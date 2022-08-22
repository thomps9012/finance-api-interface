import AggMileage from "../../components/aggMileage";
import AggCheckRequests from "../../components/aggCheckRequests";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import createClient from "../../graphql/client";
import { GET_MY_MILEAGE } from "../../graphql/queries";
import { authOptions } from "../api/auth/[...nextauth]";
import { UserOverview } from "../../types/users";
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const client = await createClient(sessionData?.Authorization);
    const res = await client.query({ query: GET_MY_MILEAGE, fetchPolicy: 'no-cache' })
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