import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
    const { data: session, status } = useSession();
    const loading = status === "loading";

    return <header>
        <p>{!session && loading ? 'loading...' : 'loaded'}</p>
        {!session && (
            <>
                <span>You are not signed in</span>
                <a href={`/api/auth/signin`} onClick={(e: any) => {
                    e.preventDefault()
                    signIn()
                }}>
                    Sign In
                </a>
            </>
        )}
        {session?.user && (
            <>
                {session.user.image && (
                    <img src={session.user.image} alt='profile image' />
                )}
                <span>
                    <small>Signed in as </small>
                    <br />
                    <strong>{session.user.name}</strong>
                </span>
                <a href={`/api/auth/signout`} onClick={(e: any) => {
                    e.preventDefault()
                    signOut()
                }}>
                    Sign Out
                </a>
            </>
        )}
    </header>
}