import { useSession } from 'next-auth/react'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import jwtDecode from 'jwt-decode'

export default function Landing() {
  const session = useSession()
  const user_token: { role: string } = jwtDecode(session?.data?.user.token)
  const user_role = user_token?.role;
  console.log('role', user_role)
  return <main className={styles.landing}>
    <div className={styles.container}>
      <h1>Finance Request Hub</h1>
      <Link href={'/me/inbox'}>
        <a><h2>Your Notifications</h2></a>
      </Link>
      <br />
      <h2>Mileage</h2>
      <hr />
      <Link href={'/me/mileage'}>
        <a><h3>Your Active Requests</h3></a>
      </Link>
      {user_role != 'EMPLOYEE' && <Link href={'/mileage/report'}>
        <a><h3>Reports</h3></a>
      </Link>
      }
      <h2>Petty Cash</h2>
      <hr />
      <Link href={'/me/pettyCash'}>
        <a><h3>Your Active Requests</h3></a>
      </Link>
      {user_role != 'EMPLOYEE' && <Link href={'/petty_cash/report'}>
        <a><h3>Reports</h3></a>
      </Link>
      }
      <h2>Check Requests</h2>
      <hr />
      <Link href={'/me/checkRequests'}>
        <a><h3>Your Active Requests</h3></a>
      </Link>
      {user_role != 'EMPLOYEE' && <Link href={'/check_request/report'}>
        <a><h3>Reports</h3></a>
      </Link>
      }
    </div>
  </main>
}


