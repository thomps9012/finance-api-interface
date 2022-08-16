import { ALL_USERS } from "../../graphql/queries";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from ".././api/auth/[...nextauth]";
import Link from "next/link";
import { BASE_USER_API } from "../../graphql/bases";
import { ALL_USERS_RES } from "../../graphql/responses";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const api = `${BASE_USER_API}${ALL_USERS}${ALL_USERS_RES}}`
    const userdata = await fetch(api).then(res => res.json())
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    return {
        props: {
            userdata: sessionData ? userdata.data.all : []
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
        {userdata.map((user: UserType) => {
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
