import jwtDecode from 'jwt-decode';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
export default function CheckRequestLanding() {
    const session = useSession()
    const user_token: { role: string } = jwtDecode(session?.data?.user.token)
    const user_role = user_token?.role;
    return <main className={styles.landing}>
        <h1>Check Request</h1>
        <Link href="/check_request/create">
            <a><h2>Create New Request</h2></a>
        </Link>
        <Link href={'/me/checkRequests'}>
            <a><h2>Your Active Requests</h2></a>
        </Link>
        {user_role != 'EMPLOYEE' && <>
            <Link href="/check_request/report/user">
                <a><h2>User Requests</h2></a>
            </Link>
            <Link href="/check_request/report/grant">
                <a><h2>Requests by Grant</h2></a>
            </Link>
        </>
        }
    </main>
}