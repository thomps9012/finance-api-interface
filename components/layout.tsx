import Header from "./header";
import Footer from "./footer";
import { useSession } from "next-auth/react";
import AccessDenied from "./accessDenied";
import Loading from "./loading";
import Head from "next/head";

interface Props {
    children: React.ReactNode
}

export default function Layout({ children }: Props) {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    if(!session && loading) {return <Loading />}
    if (!session) { return <AccessDenied /> }
    return <>
     <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </Head>
        <Header />
        <main>{children}</main>
        <Footer />
    </>
}