import AggPettyCash from "../../components/aggPettyCash";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import createClient from "../../graphql/client";
import { authOptions } from "../api/auth/[...nextauth]";
import { GET_USER_PETTY_CASH } from "../../graphql/queries";
import jwtDecode from "jwt-decode";
import { CustomJWT } from "../../types/next-auth";
import { UserPettyCash } from "../../types/pettycash";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token
    const decoded_jwt: CustomJWT = jwtDecode(jwt)
    const client = createClient(jwt);
    const res = await client.query({ query: GET_USER_PETTY_CASH, variables: {
      user_id: decoded_jwt.id
    },fetchPolicy: 'no-cache' })
    console.log(res.data, "userdata on server")
    return {
        props: {
            user_petty_cash: sessionData ? res.data.user_petty_cash_requests : []
        }
    }
}


export default function MyPettyCash({ user_petty_cash }: { user_petty_cash: UserPettyCash }) {
    return <AggPettyCash petty_cash={user_petty_cash} />
}