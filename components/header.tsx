import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./header.module.css";
import jwtDecode from "jwt-decode";
import { CustomJWT } from "../types/next-auth";

export default function Header({ jwt, profile_img }: {profile_img: string, jwt: string }) {
  const decoded_jwt: CustomJWT = jwtDecode(jwt)
  const router = useRouter();
  const {admin, name} = decoded_jwt
  const [openNav, setOpenNav] = useState(false);
  const sign_out = () => {
    deleteCookie('jwt')
    deleteCookie('profile_img')
    deleteCookie('user_name')
    router.reload();
  };
  return (
    <>
      <div className={styles.mobileHeader}>
        {jwt && (
          <>
            <Link href="/me">
              <a>
                {profile_img && (
                  <img
                    src={
                      ("/profile_imgs" +
                        profile_img) as string
                    }
                    className={styles.avatar}
                    alt="profile picture"
                  />
                )}
                <span className={styles.signedInText}>
                  <br />
                  <strong>{name.split(" ")[0]}</strong>
                </span>
              </a>
            </Link>
            <a
              className={styles.menuOption}
              onClick={() => setOpenNav(!openNav)}
              style={{ fontSize: "35px" }}
            >
              Nav
            </a>
            {jwt && (
              <div className="mobileSignOut">
                <a
                  id="mobile-btn"
                  className={styles.footerBtn}
                  onClick={sign_out}
                >
                  Logout
                </a>
              </div>
            )}
            <ul className={"navIcons-" + openNav}>
              <li className={styles.navIcon}>
                <Link href="/">
                  <a
                    className={styles.navIcon}
                    onClick={(e) => setOpenNav(false)}
                  >
                    🏡 Home
                  </a>
                </Link>
              </li>
              <li className={styles.navIcon}>
                <Link href="/me/inbox">
                  <a
                    className={styles.navIcon}
                    onClick={(e) => setOpenNav(false)}
                  >
                    📭 Inbox
                  </a>
                </Link>
              </li>
              <li className={styles.navIcon}>
                <Link href="/mileage">
                  <a
                    className={styles.navIcon}
                    onClick={(e) => setOpenNav(false)}
                  >
                    🚗 Mileage
                  </a>
                </Link>
              </li>
              <li className={styles.navIcon}>
                <Link href="/petty_cash">
                  <a
                    className={styles.navIcon}
                    onClick={(e) => setOpenNav(false)}
                  >
                    💸 Petty Cash
                  </a>
                </Link>
              </li>
              <li className={styles.navIcon}>
                <Link href="/check_request">
                  <a
                    className={styles.navIcon}
                    onClick={(e) => setOpenNav(false)}
                  >
                    📑 Check Request
                  </a>
                </Link>
              </li>
              {admin && (
                <li className={styles.navIcon}>
                  <Link href="/users">
                    <a
                      className={styles.navIcon}
                      onClick={(e) => setOpenNav(false)}
                    >
                      👨‍👦‍👦 Users
                    </a>
                  </Link>
                </li>
              )}
              <li className={styles.navIcon} id="mobile-sign-out">
                <a className={styles.navIcon} onClick={sign_out}>
                  🚀 Sign Out
                </a>
              </li>
            </ul>
          </>
        )}
      </div>
      <header>
        <div className={styles.navHeader}>
          {jwt && (
            <>
              <Link href="/me">
                <a>
                  {profile_img && (
                    <img
                      src={
                        ("/profile_imgs" +
                          profile_img) as string
                      }
                      className={styles.avatar}
                      alt="profile picture"
                    />
                  )}
                  <span className={styles.signedInText}>
                    <br />
                    <strong>{name.split(" ")[0]}</strong>
                  </span>
                </a>
              </Link>
              <ul className={styles.navIcons}>
                <li className={styles.navIcon}>
                  <Link href="/">
                    <a className={styles.navIcon}>
                      🏡<span className={styles.navSpan}>Home</span>
                    </a>
                  </Link>
                </li>
                <li className={styles.navIcon}>
                  <Link href="/me/inbox">
                    <a className={styles.navIcon}>
                      📭<span className={styles.navSpan}>Inbox</span>
                    </a>
                  </Link>
                </li>
                <li className={styles.navIcon}>
                  <Link href="/mileage">
                    <a className={styles.navIcon}>
                      🚗<span className={styles.navSpan}>Mileage</span>
                    </a>
                  </Link>
                </li>
                <li className={styles.navIcon}>
                  <Link href="/petty_cash">
                    <a className={styles.navIcon}>
                      💸<span className={styles.navSpan}>Petty Cash</span>
                    </a>
                  </Link>
                </li>
                <li className={styles.navIcon}>
                  <Link href="/check_request">
                    <a className={styles.navIcon}>
                      📑<span className={styles.navSpan}>Check Request</span>
                    </a>
                  </Link>
                </li>
                {admin && (
                  <li className={styles.navIcon}>
                    <Link href="/users">
                      <a className={styles.navIcon}>
                        👨‍👦‍👦<span className={styles.navSpan}>Users</span>
                      </a>
                    </Link>
                  </li>
                )}
              </ul>
              <a className={styles.buttonPrimary} onClick={sign_out}>
                Sign Out
              </a>
            </>
          )}
        </div>
      </header>
    </>
  );
}
