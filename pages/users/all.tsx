import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from ".././api/auth/[...nextauth]";
import Link from "next/link";
import createClient from "../../graphql/client";
import { gql } from "@apollo/client";
import { UserType } from "../../types/users";
import styles from '../../styles/Home.module.css';
import { useEffect, useState } from "react";

const USER_LIST = gql`query getUsers {
    all_users {
        id
        email
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
    const jwt = sessionData?.user.token
    const client = createClient(jwt);
    const res = await client.query({ query: USER_LIST });
    console.log(res.data, "userdata on server")
    return {
        props: {
            userdata: sessionData ? res.data.all_users : []
        }
    }
}

export default function UsersInfo({ userdata }: { userdata: UserType[] }) {
    const [userList, setUserList] = useState(userdata)
    const [selectedRoles, setRoles] = useState(['CHIEF', 'MANAGER', 'EMPLOYEE'])
    useEffect(() => {
        let filteredUsers: any[] = [];
        for (const item in selectedRoles) {
            console.log(selectedRoles[item])
            filteredUsers.push(userdata.filter((user: UserType) => user.role === selectedRoles[item]))
        }
        setUserList(filteredUsers.flatMap(x => x))
    }, [selectedRoles])
    const handleChange = (e: any) => {
        const elements = e.target.children;
        const emptyArr = [];
        for (let i = 0; i < elements.length; i++) {
            elements[i].selected && emptyArr.push(elements[i].value)
        }
        setRoles(emptyArr)
    }
    return <main className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1>Active Users</h1>
            <div style={{ flexDirection: 'column', margin: 10 }}>
                <h3>Filter by Role</h3>
                <select onChange={handleChange} value={selectedRoles} style={{ height: 80 }} multiple>
                    <option value="CHIEF">CHIEF</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="EMPLOYEE">EMPLOYEE</option>
                </select>
            </div>
        </div>
        <hr />
        {userList.map((user: UserType) => {
            const { name, id, email, role } = user;
            return <div key={id}>
                <Link href={`/users/${id}/overview`}>
                    <a><h3>{name}</h3></a>
                </Link>
                <p>{role}</p>
                <p>{email}</p>
                <div className="hr" />
            </div>
        })}
    </main>
}
