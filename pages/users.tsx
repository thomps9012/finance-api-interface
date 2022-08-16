import AccessDenied from "../components/accessDenied";
import { ALL_USERS } from "../graphql/queries";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useSession } from "next-auth/react";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const userdata = await fetch(ALL_USERS).then(res => res.json())
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
                <br />
            </div>
        })}
    </main>
}
