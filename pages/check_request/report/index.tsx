import Link from 'next/link';
import styles from '../../../styles/Home.module.css';
export default function CheckRequestReportLanding() {
    return <main className={styles.landing}>
        <h1>Check Request Reports</h1>
        <Link href="/check_request/report/user">
            <a><h2>Requests by User</h2></a>
        </Link>
        <Link href="/check_request/report/grant">
            <a><h2>Requests by Grant</h2></a>
        </Link>
    </main>
}