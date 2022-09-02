import jwtDecode from 'jwt-decode';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
export default function PettyCashLanding() {
    const session = useSession()
    const user_token: { role: string } = jwtDecode(session?.data?.user.token)
    const user_role = user_token?.role;
    return <main className={styles.landing}>
        <h1>Petty Cash</h1>
        <div className='hr' />
        <Link href="/petty_cash/create">
            <a><h2>Create New Request</h2></a>
        </Link>
        <Link href={'/me/pettyCash'}>
            <a><h2>Your Active Requests</h2></a>
        </Link>
        {user_role != 'EMPLOYEE' && <>
            <Link href="/petty_cash/report/user/null">
                <a><h2>User Requests</h2></a>
            </Link>
            <Link href="/petty_cash/report/grant">
                <a><h2>Requests by Grant</h2></a>
            </Link>
        </>}
    </main>
}