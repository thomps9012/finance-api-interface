import Link from 'next/link';
import styles from '../../../styles/Home.module.css';
export default function MileageReportLanding() {
    return <main className={styles.landing}>
        <h1>Mileage Reports</h1>
        <Link href="/mileage/report/user">
            <a><h2>User Monthly Milage</h2></a>
        </Link>
        <Link href="/mileage/report/monthly">
            <a><h2>Organization Monthly Mileage</h2></a>
        </Link>
        <Link href="/mileage/report/grant">
            <a><h2>Grant Mileage Requests</h2></a>
        </Link>
    </main>
}