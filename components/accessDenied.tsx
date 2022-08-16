import {signIn} from "next-auth/react";

export default function AccessDenied(){
    return <>
    <h1>Access Denied</h1>
    <p>
        <a href={'/api/auth/signin'}
        onClick={(e: any) => {
            e.preventDefault()
            signIn()
        }}>
            You Must Sign In to View this Page
        </a>
    </p>
    </>
}