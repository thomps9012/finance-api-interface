import AggMileage from "../../components/aggMileage";
import { NextApiRequest, NextApiResponse } from "next";
import createClient from "../../graphql/client";
import { GET_USER_MILEAGE } from "../../graphql/queries";
import { UserMileage } from "../../types/mileage";
import jwtDecode from "jwt-decode";
import { CustomJWT } from "../../types/next-auth";
import { getCookie } from "cookies-next";

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const jwt = getCookie("jwt", { req, res }) as string;
  const client = createClient(jwt);
  const decoded_jwt: CustomJWT = jwtDecode(jwt);
  const response = await client.query({
    query: GET_USER_MILEAGE,
    variables: {
      id: decoded_jwt.id,
    },
    fetchPolicy: "no-cache",
  });
  return {
    props: {
      user_mileage: jwt != undefined ? response.data.user_mileage : [],
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
