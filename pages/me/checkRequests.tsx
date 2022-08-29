import AggCheckRequests from "../../components/aggCheckRequests";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import createClient from "../../graphql/client";
import { authOptions } from "../api/auth/[...nextauth]";
import { UserOverview } from "../../types/users";
import { gql } from "@apollo/client";
const GET_MY_CHECKS = gql`{
    me {
      id
      name
      last_login
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
    }
  }
  `;
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token
    const client = createClient(jwt);
    const res = await client.query({ query: GET_MY_CHECKS, fetchPolicy: 'no-cache' })
    console.log(res.data, "userdata on server")
    return {
        props: {
            userdata: sessionData ? res.data.me : []
        }
    }
}

export default function MyCheckRequests({ userdata }: { userdata: UserOverview }) {
    return <AggCheckRequests check_requests={userdata.check_requests} />
}