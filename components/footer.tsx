import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import styles from './header.module.css';
export default function Footer() {
    const { data: session } = useSession();
    return <footer>
        <h5>Copyright 2022</h5>
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
    </footer>
}