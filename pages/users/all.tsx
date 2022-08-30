import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from ".././api/auth/[...nextauth]";
import Link from "next/link";
import createClient from "../../graphql/client";
import { gql } from "@apollo/client";
const USER_LIST = gql`query getUsers {
    all_users {
        id
        name
        role
    }
}`
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.Authorization
    const client = createClient(jwt);
    const res = await client.query({ query: USER_LIST });
    console.log(res.data, "userdata on server")
    return {
        props: {
            userdata: sessionData ? res.data.all_users : []
        }
    }
}


interface UserType {
    id: string;
    email: string;
    name: string;
    role: string;
}

export default function UsersInfo({ userdata }: any) {
    return <main>
        <h1>User Data from All Query</h1>
        {userdata.filter((user: UserType) => user.role != null).map((user: UserType) => {
            const { name, id, email, role } = user;
            return <div key={id}>
                <p>{name}</p>
                <p>{email}</p>
                <p>{role}</p>
                <Link href={`/users/${id}/overview`}>
                    <a>User Records</a>
                </Link>
                <hr />
            </div>
        })}
    </main>
}
