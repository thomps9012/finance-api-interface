import Link from "next/link";
import styles from "./header.module.css"
export default function NavLinks() {
    return <nav>
        <ul className={styles.navItems}>
            <li className={styles.navItem}>
                <Link href="/">
                    <a>Home</a>
                </Link>
            </li>
            {/* add in admin session checker for link */}
            <li className={styles.navItem}>
                <Link href="/users/all">
                    <a>All Users</a>
                </Link>
            </li>
            <li className={styles.navItem}>
                <Link href="/me">
                    <a>Your Info</a>
                </Link>
            </li>
            <li className={styles.navItem}>
                <Link href="/mileage/create">
                    <a>Add Mileage</a>
                </Link>
            </li>
            <li className={styles.navItem}>
                <Link href="/check_request/create">
                    <a>Create Check Request</a>
                </Link>
            </li>
            <li className={styles.navItem}>
                <Link href="/petty_cash/create">
                    <a>Request Petty Cash</a>
                </Link>
            </li>
        </ul>
    </nav>
}