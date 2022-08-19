import { signIn } from "next-auth/react";
export default function AccessDenied() {
    return <>
        <h1>Access Denied</h1>
        <h2>You Must</h2>
        <p>
            <a href={'/api/auth/signin'}
                onClick={(e: any) => {
                    e.preventDefault()
                    signIn("google")
                }}>
                Sign In
            </a>
        </p>
        <h2>To View this Page</h2>
    </>
}