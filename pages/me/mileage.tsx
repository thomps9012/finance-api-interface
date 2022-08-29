import AggMileage from "../../components/aggMileage";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import createClient from "../../graphql/client";
import { authOptions } from "../api/auth/[...nextauth]";
import { UserOverview } from "../../types/users";
import { gql } from "@apollo/client";
const GET_MY_MILEAGE = gql`{
    me {
      id
      name
      last_login
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