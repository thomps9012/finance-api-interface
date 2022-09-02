import jwtDecode from 'jwt-decode';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
export default function UserLandingPage() {
    const session = useSession()
    const user_token: { role: string } = jwtDecode(session?.data?.user.token)
    const user_role = user_token?.role;
    { user_role === 'EMPLOYEE' && <main className={styles.landing}><h1>You are not authorized to access this page</h1></main> }
    return <main className={styles.landing}>
        <h1>User Actions</h1>
        <div className='hr' />
        <Link href='/users/all'>
            <a><h2>User List</h2></a>
        </Link>
        <Link href='/users/create'>
            <a><h2>Add New</h2></a>
        </Link>
    </main>
}