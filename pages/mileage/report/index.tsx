import Link from 'next/link';
import styles from '../../../styles/Home.module.css';
export default function MileageReportLanding() {
    return <main className={styles.landing}>
        <h1>Mileage Reports</h1>
        <Link href="/mileage/reports/user">
            <a><h2>User Monthly Mileag</h2></a>
        </Link>
        <Link href="/mileage/reports/monthly">
            <a><h2>Organization Monthly Mileage</h2></a>
        </Link>
        <Link href="/mileage/reports/grant">
            <a><h2>Grant Mileage Requests</h2></a>
        </Link>
    </main>
}