import Link from 'next/link';
import styles from '../../../styles/Home.module.css';
export default function PettyCashReportLanding() {
    return <main className={styles.landing}>
        <h1>Petty Cash Reports</h1>
        <Link href="/petty_cash/reports/user">
            <a><h2>Requests by User</h2></a>
        </Link>
        <Link href="/petty_cash/reports/grant">
            <a><h2>Requests by Grant</h2></a>
        </Link>
    </main>
}