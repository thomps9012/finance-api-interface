import AggPettyCash from "../../components/aggPettyCash";
import createClient from "../../graphql/client";
import { GET_USER_PETTY_CASH } from "../../graphql/queries";
import jwtDecode from "jwt-decode";
import { CustomJWT } from "../../types/next-auth";
import { UserPettyCash } from "../../types/pettycash";

import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
export const getServerSideProps = async ({req, res}: {req: NextApiRequest, res: NextApiResponse}) => {
  const jwt = getCookie("jwt", {req, res});
    const decoded_jwt: CustomJWT = jwtDecode(jwt as string)
    const client = createClient(jwt);
    const response = await client.query({ query: GET_USER_PETTY_CASH, variables: {
      user_id: decoded_jwt.id
    },fetchPolicy: 'no-cache' })
    return {
        props: {
            user_petty_cash: jwt != undefined ? response.data.user_petty_cash_requests : []
        }
    }
}


export default function MyPettyCash({ user_petty_cash }: { user_petty_cash: UserPettyCash }) {
    return <AggPettyCash petty_cash={user_petty_cash} />
}