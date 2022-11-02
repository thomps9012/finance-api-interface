import AggCheckRequests from "../../components/aggCheckRequests";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import createClient from "../../graphql/client";
import { authOptions } from "../api/auth/[...nextauth]";
import { GET_USER_CHECK_REQUESTS } from "../../graphql/queries";
import jwtDecode from "jwt-decode";
import { CustomJWT } from "../../types/next-auth";
import { UserCheckRequests } from "../../types/checkrequests";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token
    const decoded_jwt: CustomJWT = jwtDecode(jwt)
    const client = createClient(jwt);
    const res = await client.query({ query: GET_USER_CHECK_REQUESTS, variables: {
      id: decoded_jwt.id
    }, fetchPolicy: 'no-cache' })
    return {
        props: {
            user_check_requests: sessionData ? res.data.user_check_requests : []
        }
    }
}

export default function MyCheckRequests({ user_check_requests }: { user_check_requests: UserCheckRequests }) {
    return <AggCheckRequests check_requests={user_check_requests} />
}