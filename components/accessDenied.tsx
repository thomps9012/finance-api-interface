import { signIn } from "next-auth/react";
import styles from '../styles/Home.module.css';
export default function AccessDenied() {
    return <div style={{ margin: 100, padding: 20, display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
        <h1>Access Denied</h1>
        <div className="hr-red" />
        <h1>You are Attempting to Visit a Protected Website</h1>
        <br />
        <br />
        <div>
            <a href={'/api/auth/signin'}
                onClick={(e: any) => {
                    e.preventDefault()
                    signIn("google")
                }} className={styles.buttonPrimary}>
                Sign In
            </a>
        </div>
    </div>
}