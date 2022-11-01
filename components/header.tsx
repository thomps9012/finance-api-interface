import jwtDecode from "jwt-decode";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import styles from "./header.module.css"

export default function Header() {
    const { data: session } = useSession();
    const [openNav, setOpenNav] = useState(false);
    const user_token: { permissions: string[] } = jwtDecode(session?.user.token)
    const user_permissions = user_token?.permissions;
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
                    <a className={styles.menuOption} onClick={() => setOpenNav(!openNav)}>Nav Menu</a>
                    {session?.user && (
                        <div className='mobileSignOut'>
                            <a href={`/api/auth/signout`}
                                id='mobile-btn'
                                className={styles.footerBtn} onClick={(e: any) => {
                                    e.preventDefault()
                                    signOut({ callbackUrl: '/' })
                                }}>
                                Sign Out
                            </a>
                        </div>
                    )}
                    <ul className={"navIcons-" + openNav}>
                        <li className={styles.navIcon}>
                            <Link href="/">
                                <a className={styles.navIcon} onClick={(e) => setOpenNav(false)}>🏡 Home</a>
                            </Link>
                        </li>
                        <li className={styles.navIcon}>
                            <Link href="/me/inbox">
                                <a className={styles.navIcon} onClick={(e) => setOpenNav(false)}>📭 Inbox</a>
                            </Link>
                        </li>
                        <li className={styles.navIcon}>
                            <Link href="/mileage">
                                <a className={styles.navIcon} onClick={(e) => setOpenNav(false)}>🚗 Mileage</a>
                            </Link>
                        </li>
                        <li className={styles.navIcon}>
                            <Link href="/petty_cash">
                                <a className={styles.navIcon} onClick={(e) => setOpenNav(false)}>💸 Petty Cash</a>
                            </Link>
                        </li>
                        <li className={styles.navIcon}>
                            <Link href="/check_request">
                                <a className={styles.navIcon} onClick={(e) => setOpenNav(false)}>📑 Check Request</a>
                            </Link>
                        </li>
                        {user_permissions.find(() => "ADMIN") != undefined && <li className={styles.navIcon}>
                            <Link href="/users">
                                <a className={styles.navIcon} onClick={(e) => setOpenNav(false)}>👨‍👦‍👦 Users</a>
                            </Link>
                        </li>}
                        <li className={styles.navIcon} id='mobile-sign-out'>
                            <a href={`/api/auth/signout`}
                                className={styles.navIcon} onClick={(e: any) => {
                                    e.preventDefault()
                                    signOut({ callbackUrl: '/' })
                                }}>🚀 Sign Out</a>
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
                                    <a className={styles.navIcon}>🏡<span className={styles.navSpan}>Home</span></a>
                                </Link>
                            </li>
                            <li className={styles.navIcon}>
                                <Link href="/me/inbox">
                                    <a className={styles.navIcon}>📭<span className={styles.navSpan}>Inbox</span></a>
                                </Link>
                            </li>
                            <li className={styles.navIcon}>
                                <Link href="/mileage">
                                    <a className={styles.navIcon}>🚗<span className={styles.navSpan}>Mileage</span></a>
                                </Link>
                            </li>
                            <li className={styles.navIcon}>
                                <Link href="/petty_cash">
                                    <a className={styles.navIcon}>💸<span className={styles.navSpan}>Petty Cash</span></a>
                                </Link>
                            </li>
                            <li className={styles.navIcon}>
                                <Link href="/check_request">
                                    <a className={styles.navIcon}>📑<span className={styles.navSpan}>Check Request</span></a>
                                </Link>
                            </li>
                            {user_permissions.find(() => "ADMIN") != undefined && <li className={styles.navIcon}>
                                <Link href="/users">
                                    <a className={styles.navIcon}>👨‍👦‍👦<span className={styles.navSpan}>Users</span></a>
                                </Link>
                            </li>}
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
        </header>
    </>
}