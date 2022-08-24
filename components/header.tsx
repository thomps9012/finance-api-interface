import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./header.module.css"
import NavLinks from "./navLinks";

export default function Header() {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    return <header>
        <noscript>
            <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
        </noscript>
        <div className={styles.signedInStatus}>
            <p className={`nojs-show ${!session && loading ? styles.loading : styles.loaded}`}>
                {!session && (
                    <>
                        <span className={styles.notSignedInText}>
                            You are not signed in
                        </span>
                        <a href={`/api/auth/signin`}
                            className={styles.buttonPrimary}
                            onClick={(e: any) => {
                                e.preventDefault()
                                signIn("google")
                            }}>
                            Sign In
                        </a>
                    </>
                )}
                {session?.user && (
                    <>
                        {session.user.image && (
                            <span
                                style={{ backgroundImage: `url('${session.user.image}')` }}
                                className={styles.avatar}
                            />
                        )}
                        <span className={styles.signedInText}>
                            <small>Signed in as </small>
                            <br />
                            <strong>{session.user.name}</strong>
                        </span>
                        <a href={`/api/auth/signout`}
                            className={styles.button} onClick={(e: any) => {
                                e.preventDefault()
                                signOut({ callbackUrl: '/signOut' })
                            }}>
                            Sign Out
                        </a>
                       
                    </>
                )}
            </p>
        </div>
        <NavLinks />
    </header>
}