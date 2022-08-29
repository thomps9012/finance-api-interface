import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import createClient from "../../../graphql/client";
import { ALL_USERS, USER_MANAGER, USER_OVERVIEW } from "../../../graphql/queries";
import { UserOverview } from "../../../types/users";
import { authOptions } from "../../api/auth/[...nextauth]";
import styles from '../../../styles/Home.module.css';
import { useState } from "react";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { id } = context.query
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.Authorization
    const client = createClient(jwt);
    const res = await client.query({ query: USER_OVERVIEW, variables: { id } })
    console.log(res.data, 'user overview')
    const user_manager_id = res.data.user_overview.manager_id;
    const manager_res = await client.query({ query: USER_MANAGER, variables: { id: user_manager_id } })
    const manager_name = manager_res.data.user_overview.name;
    const allUserRes = await client.query({ query: ALL_USERS });
    const users = allUserRes.data.all_users
    const managers = users.filter((user: { role: string; }) => user.role == "" || user.role == "")
    return {
        props: {
            userdata: sessionData ? res.data.user_overview : [],
            manager_name: sessionData ? manager_name : "",
            manager_list: sessionData ? managers : [],
        }
    }
}
export default function EditUser({ userdata, manager_name, manager_list }: { userdata: UserOverview, manager_name: string, manager_list: UserOverview }) {
    return <main className={styles.main}>
        <form>
            <h3>Name</h3>
            <h3>Email</h3>
            <h3>Manager</h3>
        </form>
    </main>
}