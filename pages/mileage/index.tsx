import jwtDecode from 'jwt-decode';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
export default function MileageLanding() {
    const session = useSession()
    const user_token: { role: string } = jwtDecode(session?.data?.user.token)
    const user_role = user_token?.role;
    return <main className={styles.landing}>
        <h1>Mileage</h1>
        <Link href="/mileage/create">
            <a><h2>Create New Request</h2></a>
        </Link>
        <Link href={'/me/mileage'}>
            <a><h2>Your Active Requests</h2></a>
        </Link>
        {user_role != 'EMPLOYEE' && <>
            <Link href="/mileage/report/user">
                <a><h2>User Mileage</h2></a>
            </Link>
            <Link href="/mileage/report/monthly">
                <a><h2>Organization Monthly Mileage</h2></a>
            </Link>
            <Link href="/mileage/report/grant">
                <a><h2>Grant Mileage</h2></a>
            </Link>
        </>
        }
    </main>
}