import jwtDecode from "jwt-decode";
import { useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./header.module.css"
export default function NavLinks() {
    const { data: token } = useSession();
    const jwtData: { role: string } = jwtDecode(token?.user.token)
    const { role } = jwtData
    console.log(role)
    return <nav>
        <ul className={styles.navItems}>
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
            {role != 'EMPLOYEE' && <li className={styles.navItem}>
            <Link href="/users/create">
                <a>Add User</a>
            </Link>
            </li>}
        </ul>
    </nav>
}