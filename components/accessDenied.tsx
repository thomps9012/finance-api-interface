import { signIn } from "next-auth/react";
export default function AccessDenied() {
    return <div style={{ margin: 100, padding: 20 }}>
        <h1>Access Denied</h1>
        <h1>You are attempting to visit a protected website</h1>
        <h1>You Must</h1>
        <a href={'/api/auth/signin'}
            onClick={(e: any) => {
                e.preventDefault()
                signIn("google")
            }} style={{ backgroundColor: 'white', color: 'black', width: 'fit-content', padding: 10, fontSize: 35, borderRadius: 5, border: '1px solid black' }} id='btn'>
            Sign In
        </a>
    </div>
}