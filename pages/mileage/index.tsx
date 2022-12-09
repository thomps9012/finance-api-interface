import jwtDecode from 'jwt-decode';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import { CustomJWT } from '../../types/next-auth';
export default function MileageLanding() {
    const session = useSession()
    const user_token: CustomJWT = jwtDecode(session?.data?.user.token);
    const admin = user_token?.admin;
    return <main className={styles.landing}>
        <h1>Mileage</h1>
        <div className='hr' />
        <Link href="/mileage/create">
            <a><h2>Create New Request</h2></a>
        </Link>
        <Link href={'/me/mileage'}>
            <a><h2>Your Active Requests</h2></a>
        </Link>
        {admin && <>
            <Link href="/mileage/report/user/null">
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