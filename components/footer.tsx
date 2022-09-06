import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import styles from './header.module.css';
export default function Footer() {
    const { data: session } = useSession();
    return <footer>
        <h5>Copyright 2022</h5>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
       
            <a href="https://thomps9012-github-io.vercel.app/">
                <p>Designed by
                    <br />
                    Samuel Thompson WebDesign
                </p>
            </a>
        </div>
    </footer>
}