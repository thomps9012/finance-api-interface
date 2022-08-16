import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
    const { data: session } = useSession();
    session ? <>
        Signed in as {session?.user?.email}
        <button onClick={() => signOut()}>Sign Out</button>
    </> : <>
        Not Signed In <br />
        <button onClick={() => signIn()}>Sign In</button>
    </>
}