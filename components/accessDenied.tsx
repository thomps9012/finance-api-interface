import { signIn } from "next-auth/react";
import createUser from "../pages/api/auth/adapter/index"
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
        {/* <h5>or</h5>
        <p>
            <a href={'/api/auth/create'}
                onClick={(e: any) => {
                    e.preventDefault()
                    createUser()
                }}>
                Create an Account
            </a>
        </p> */}
        <h2>To View this Page</h2>
    </>
}