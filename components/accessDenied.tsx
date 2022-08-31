import { signIn } from "next-auth/react";
import styles from '../styles/Home.module.css';
export default function AccessDenied() {
    return <div style={{ margin: 100, padding: 20 }}>
        <h1>Access Denied</h1>
        <h1>You are Attempting to Visit a Protected Website</h1>
        <br />
        <hr />
        <br />
        <br />
        <a href={'/api/auth/signin'}
            onClick={(e: any) => {
                e.preventDefault()
                signIn("google")
            }} className={styles.buttonPrimary}>
            Sign In
        </a>
    </div>
}