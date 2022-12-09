import jwtDecode from 'jwt-decode';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import { CustomJWT } from '../../types/next-auth';
export default function CheckRequestLanding() {
    const session = useSession()
    const user_token: CustomJWT = jwtDecode(session?.data?.user.token);
    const admin = user_token?.admin;
    return <main className={styles.landing}>
        <h1>Check Request</h1>
        <div className='hr' />
        <Link href="/check_request/create">
            <a><h2>Create New Request</h2></a>
        </Link>
        <Link href={'/me/checkRequests'}>
            <a><h2>Your Active Requests</h2></a>
        </Link>
        {admin && <>
            <Link href="/check_request/report/user/null">
                <a><h2>User Requests</h2></a>
            </Link>
            <Link href="/check_request/report/grant">
                <a><h2>Requests by Grant</h2></a>
            </Link>
        </>
        }
    </main>
}