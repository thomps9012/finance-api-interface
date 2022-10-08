import { gql } from '@apollo/client';
import jwtDecode from 'jwt-decode';
import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import createClient from '../../graphql/client';
import { CREATE_USER } from '../../graphql/mutations';
import styles from '../../styles/Home.module.css';
import { UserType } from '../../types/users';
import { authOptions } from '../api/auth/[...nextauth]';
const USER_LIST = gql`query getUsers {
    all_users {
        id
        name
        email
        role
    }
}`
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token
    const client = createClient(jwt);
    const users = await client.query({ query: USER_LIST })
    const userInfo: { role: string } = jwtDecode(jwt);
    const userRole = userInfo.role;
    return {
        props: {
            user_list: sessionData ? users.data.all_users : null,
            jwt: jwt ? jwt : "",
            userRole: jwt ? userRole : ""
        }
    }
}
export default function CreateUser({ jwt, user_list, userRole }: { userRole: string, user_list: UserType[], jwt: string }) {
    const router = useRouter();
    const [selectedManager, setManager] = useState("")
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const userData = Object.fromEntries(new FormData(e.target))
        console.log(Object.values(userData))
        for (const item in Object.values(userData)){
            if(Object.values(userData)[item] === ""){
                alert('must enter a valid employee '+Object.keys(userData)[item])
                return;
            }
        }
        const managerInfo = JSON.parse(userData.manager_info as string)
        console.log(JSON.parse(userData.manager_info as string))
        const client = createClient(jwt);
        const res = await client.mutate({
            mutation: CREATE_USER,
            variables: {
                name: userData.name,
                role: userData.role,
                manager_id: managerInfo.id,
                manager_email: managerInfo.email,
                email: `${userData.email}`
            }
        })
        console.log(res.data)
        res.data?.add_user.is_active ? router.push(`/users/${res.data.add_user.id}/overview`) : null;
    }
    userRole === 'EMPLOYEE' && <main className={styles.landing}><h1>You are Unauthorized to Create New Users</h1></main>
    return <main className={styles.container}>
        <h2>Create New User</h2>
        <form id='new-user-form' onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input type="text" max={20} name="name" />
            <label>Email</label>
            <input type="text" max={40} name="email" />
            {/* possibly swap below to select */}
            <label>Role</label>
            <select name="role" defaultValue="">
                <option value={""} hidden disabled>Select...</option>
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
                <option value="CHIEF">Chief</option>
                <option value="FINANCE">Finance Head</option>
            </select>
            <label>Manager</label>
            <select value={selectedManager} name="manager_info" onChange={(e: any) => setManager(e.target.value)}>
                <option value={""}>Select...</option>
                {user_list.map((user: UserType) => <option key={user.id} value={JSON.stringify(user)}>{user.name}</option>)}
            </select>
            <br />
            <br />
            <button type="submit" className="submit" style={{ padding: 10, margin: 10 }}>Create Account</button>
        </form>
    </main>
}