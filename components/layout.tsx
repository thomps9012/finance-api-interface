import Header from "./header";
import Footer from "./footer";
import { useSession } from "next-auth/react";
import AccessDenied from "./accessDenied";
import Loading from "./loading";

interface Props {
    children: React.ReactNode
}

export default function Layout({ children }: Props) {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    if(!session && loading) {return <Loading />}
    if (!session) { return <AccessDenied /> }
    return <>
        <Header />
        <main>{children}</main>
        <Footer />
    </>
}