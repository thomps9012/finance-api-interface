import AggCheckRequests from "../../components/aggCheckRequests";
import { NextApiRequest, NextApiResponse } from "next";
import createClient from "../../graphql/client";
import { GET_USER_CHECK_REQUESTS } from "../../graphql/queries";
import jwtDecode from "jwt-decode";
import { CustomJWT } from "../../types/next-auth";
import { UserCheckRequests } from "../../types/checkrequests";
import { getCookie } from "cookies-next";

export const getServerSideProps = async ({req, res}: {req: NextApiRequest, res: NextApiResponse}) => {
    const jwt = getCookie("jwt", {req, res});
    const decoded_jwt: CustomJWT = jwtDecode(jwt as string)
    const client = createClient(jwt);
    const response = await client.query({ query: GET_USER_CHECK_REQUESTS, variables: {
      id: decoded_jwt.id
    }, fetchPolicy: 'no-cache' })
    return {
        props: {
            user_check_requests: jwt != undefined ? response.data.user_check_requests : []
        }
    }
}

export default function MyCheckRequests({ user_check_requests }: { user_check_requests: UserCheckRequests }) {
    return <AggCheckRequests check_requests={user_check_requests} />
}