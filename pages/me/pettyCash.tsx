import AggPettyCash from "../../components/aggPettyCash";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import createClient from "../../graphql/client";
import { authOptions } from "../api/auth/[...nextauth]";
import { UserOverview } from "../../types/users";
import { gql } from "@apollo/client";
const GET_MY_PETTY_CASH = gql`{
    me {
      id
      name
      last_login
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
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token
    const client = createClient(jwt);
    const res = await client.query({ query: GET_MY_PETTY_CASH, fetchPolicy: 'no-cache' })
    console.log(res.data, "userdata on server")
    return {
        props: {
            userdata: sessionData ? res.data.me : []
        }
    }
}


export default function MyPettyCash({ userdata }: { userdata: UserOverview }) {
    return <AggPettyCash petty_cash={userdata.petty_cash_requests} />
}