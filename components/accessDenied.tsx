import { signIn } from "next-auth/react";
import Head from "next/head";
export default function AccessDenied() {
  return (
    <div
      style={{
        margin: 100,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
      }}
    >
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
      <h1>Access Denied</h1>
      <div className="hr-red" />
      <h1>You are Attempting to Visit a Protected Website</h1>
      <br />
      <div>
        <a
          href={"/api/auth/signin"}
          onClick={(e: any) => {
            e.preventDefault();
            signIn("google");
          }}
          className="archive-btn"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}
