import { useSession, signIn, signOut } from "next-auth/react";

export default function AccessToken() {
    const { data } = useSession();
    if (data) {
        const { accessToken } = data;
        return <>Access Token: {accessToken}</>
    } else {
        return <div>No Access Token</div>
    }
}