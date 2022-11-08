import { v4 } from "uuid";
import Head from "next/head";
import { useState } from "react";
import createClient from "../graphql/client";
import { LOGIN } from "../graphql/mutations";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
export default function Login() {
  const client = createClient("");
  const router = useRouter();
  const [permissions, setPermissions] = useState(Array<string>());
  const [admin, setAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [full_name, setName] = useState("");
  const set_permissions = (e: any) => {
    const set = e.target.value;
    set != "EMPLOYEE" && setAdmin(true);
    setPermissions(set);
  };
  const sign_up = async () => {
    if (full_name === "") {
      document.getElementById("name-accept")?.setAttribute("id", "name-reject");
      return;
    } else {
      document.getElementById("name-reject")?.setAttribute("id", "name-accept");
    }
    if (permissions.length === 0) {
      document.getElementById("role-accept")?.setAttribute("id", "role-reject");
      return;
    } else {
      document.getElementById("role-reject")?.setAttribute("id", "role-accept");
    }
    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      document
        .getElementById("email-accept")
        ?.setAttribute("id", "email-reject");
      return;
    } else {
      document
        .getElementById("email-reject")
        ?.setAttribute("id", "email-accept");
    }
    const id = v4();
    const res = await client.mutate({
      mutation: LOGIN,
      variables: {
        id: id,
        email: email,
        name: full_name,
        permissions: permissions,
        admin: admin,
      },
    });
    const profile_imgs = [
      "bugs.jpg",
      "daffy.jpg",
      "garfield.jpg",
      "its_fine.jpg",
      "jerry.png",
      "mr_crabby.jpg",
      "tom.jpg",
    ];
    const random_profile = profile_imgs[Math.floor(Math.random() * 6)];
    const profile_img = "/" + random_profile;
    try {
      setCookie("jwt", res.data.login);
      setCookie("profile_img", profile_img);
      setCookie("user_name", email.split("@")[0]);
    } finally {
      res.data.login != "" && router.push("/");
    }
  };
  const login = async () => {
    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      document
        .getElementById("email-accept")
        ?.setAttribute("id", "email-reject");
      return;
    } else {
      document
        .getElementById("email-reject")
        ?.setAttribute("id", "email-accept");
    }
    const id = v4();
    const res = await client.mutate({
      mutation: LOGIN,
      variables: {
        id: id,
        email: email,
        name: full_name,
        permissions: permissions,
        admin: admin,
      },
    });
    const profile_imgs = [
      "bugs.jpg",
      "daffy.jpg",
      "garfield.jpg",
      "its_fine.jpg",
      "jerry.png",
      "mr_crabby.jpg",
      "tom.jpg",
    ];
    const random_profile = profile_imgs[Math.floor(Math.random() * 6)];
    const profile_img = "/" + random_profile;
    try {
      setCookie("jwt", res.data.login);
      setCookie("profile_img", profile_img);
      setCookie("user_name", email.split("@")[0]);
    } finally {
      res.data.login != "" && router.push("/");
    }
  };
  const display_login = () => {
    document
      .getElementById("login-header")
      ?.setAttribute("id", "login-header-hid");
    document.getElementById("login")?.setAttribute("id", "login-shown");
    document
      .getElementById("sign_up-header-hid")
      ?.setAttribute("id", "sign_up-header");
    document.getElementById("sign_up-shown")?.setAttribute("id", "sign_up");
  };
  const display_signup = () => {
    document
      .getElementById("login-header-hid")
      ?.setAttribute("id", "login-header");
    document
      .getElementById("sign_up-header")
      ?.setAttribute("id", "sign_up-header-hid");
    document.getElementById("login-shown")?.setAttribute("id", "login");
    document.getElementById("sign_up")?.setAttribute("id", "sign_up-shown");
  };
  return (
    <div
      style={{
        margin: 50,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
      <nav
        style={{ display: "flex", justifyContent: "space-between", margin: 10 }}
      >
        <h3 className="approve-btn" id="login-header" onClick={display_login}>
          Login Instead
        </h3>
        <h3
          className="approve-btn"
          id="sign_up-header-hid"
          onClick={display_signup}
        >
          Sign Up Instead
        </h3>
      </nav>
      <form id="sign_up-shown" style={{ margin: 10 }}>
        <h3>As A..</h3>
        <select
          defaultValue=""
          className="signup-input"
          onChange={set_permissions}
        >
          <option value="" disabled hidden>
            Role Select...
          </option>
          <option value="EMPLOYEE">Employee</option>
          <option value="SUPERVISOR">Supervisor</option>
          <option value="MANAGER">Manager</option>
          <option value="EXECUTIVE">Executive</option>
          <option value="FINANCE_TEAM">Finance Team Member</option>
        </select>
        <label className="role-reject" id="role-accept">
          Select a Role
        </label>
        <br />
        <h3>Full Name</h3>
        <input
          type="text"
          id="signup-name"
          className="signup-input"
          onChange={(e: any) => setName(e.target.value)}
        />
        <label className="name-reject" id="name-accept">
          Enter a valid Name
        </label>
        <h3>Email</h3>
        <input
          type="email"
          id="signup-email"
          className="signup-input"
          onChange={(e: any) => setEmail(e.target.value)}
        />
        <label className="email-reject" id="email-accept">
          Enter a valid Email
        </label>
        <br />
        <br />
        <a onClick={sign_up} className="archive-btn">
          Sign Up
        </a>
      </form>
      <form id="login" style={{ margin: 10 }}>
        <h3>Email</h3>
        <input
          type="email"
          className="signup-input"
          onChange={(e: any) => setEmail(e.target.value)}
        />
        <label className="email-reject" id="email-accept">
          Enter a valid Email
        </label>
        <br />
        <br />
        <a onClick={login} className="archive-btn">
          Login
        </a>
      </form>
    </div>
  );
}
