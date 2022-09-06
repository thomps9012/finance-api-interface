import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./header.module.css"
import NavLinks from "./navLinks";

export default function Header() {
    const { data: session } = useSession();
    return <>
        <div className={styles.mobileHeader}>
            {session?.user && (
                <>
                    <Link href="/me">
                        <a>
                            {session.user.image && (
                                <span
                                    style={{ backgroundImage: `url('${session.user.image}')` }}
                                    className={styles.avatar}
                                />
                            )}
                            <span className={styles.signedInText}>
                                <br />
                                <strong>{session.user.name}</strong>
                            </span>
                        </a>
                    </Link>
                    {session?.user && (
                        <div className='mobileSignOut'>
                            <a href={`/api/auth/signout`}
                                className={styles.footerBtn} onClick={(e: any) => {
                                    e.preventDefault()
                                    signOut({ callbackUrl: '/' })
                                }}>
                                Sign Out
                            </a>
                        </div>
                    )}
                    <ul className={styles.navIcons}>
                        <li className={styles.navIcon}>
                            <Link href="/">
                                <a className={styles.navIcon}>🏡</a>
                            </Link>
                        </li>
                        <li className={styles.navIcon}>
                            <Link href="/me/inbox">
                                <a className={styles.navIcon}>📭</a>
                            </Link>
                        </li>
                        <li className={styles.navIcon}>
                            <Link href="/mileage">
                                <a className={styles.navIcon}>🚗</a>
                            </Link>
                        </li>
                        <li className={styles.navIcon}>
                            <Link href="/petty_cash">
                                <a className={styles.navIcon}>💸</a>
                            </Link>
                        </li>
                        <li className={styles.navIcon}>
                            <Link href="/check_request">
                                <a className={styles.navIcon}>📑</a>
                            </Link>
                        </li>
                    </ul>
                   
                </>
            )}
        </div>
        <header>
            <div className={styles.navHeader}>
                {session?.user && (
                    <>
                        <Link href="/me">
                            <a>
                                {session.user.image && (
                                    <span
                                        style={{ backgroundImage: `url('${session.user.image}')` }}
                                        className={styles.avatar}
                                    />
                                )}
                                <span className={styles.signedInText}>
                                    <br />
                                    <strong>{session.user.name}</strong>
                                </span>
                            </a>
                        </Link>
                        <ul className={styles.navIcons}>
                            <li className={styles.navIcon}>
                                <Link href="/">
                                    <a className={styles.navIcon}>🏡</a>
                                </Link>
                            </li>
                            <li className={styles.navIcon}>
                                <Link href="/me/inbox">
                                    <a className={styles.navIcon}>📭</a>
                                </Link>
                            </li>
                            <li className={styles.navIcon}>
                                <Link href="/mileage">
                                    <a className={styles.navIcon}>🚗</a>
                                </Link>
                            </li>
                            <li className={styles.navIcon}>
                                <Link href="/petty_cash">
                                    <a className={styles.navIcon}>💸</a>
                                </Link>
                            </li>
                            <li className={styles.navIcon}>
                                <Link href="/check_request">
                                    <a className={styles.navIcon}>📑</a>
                                </Link>
                            </li>
                        </ul>
                        <a href={`/api/auth/signout`}
                            className={styles.buttonPrimary} onClick={(e: any) => {
                                e.preventDefault()
                                signOut({ callbackUrl: '/' })
                            }}>
                            Sign Out
                        </a>
                    </>
                )}
            </div>
            <NavLinks />
        </header>
    </>
}