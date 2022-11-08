import Header from "./header";
import Footer from "./footer";
import Head from "next/head";
import { getCookie } from "cookies-next";
import Login from "./login";
interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const jwt = getCookie("jwt") as string;
  const profile_img = getCookie("profile_img") as string;
  if (jwt === undefined) return <Login />;
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header jwt={jwt} profile_img={profile_img} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
