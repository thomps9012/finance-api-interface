import AggMileage from "../../components/aggMileage";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import createClient from "../../graphql/client";
import { authOptions } from "../api/auth/[...nextauth]";
import { GET_USER_MILEAGE } from "../../graphql/queries";
import { UserMileage } from "../../types/mileage";
import jwtDecode from "jwt-decode";
import { CustomJWT } from "../../types/next-auth";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const sessionData = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  const jwt = sessionData?.user.token;
  const decoded_jwt: CustomJWT = jwtDecode(jwt);
  const client = createClient(jwt);
  const res = await client.query({
    query: GET_USER_MILEAGE,
    variables: {
      id: decoded_jwt.id,
    },
    fetchPolicy: "no-cache",
  });
  return {
    props: {
      user_mileage: sessionData ? res.data.user_mileage : [],
    },
  };
};

export default function MyMileage({
  user_mileage,
}: {
  user_mileage: UserMileage;
}) {
  return <AggMileage mileage_requests={user_mileage} />;
}
