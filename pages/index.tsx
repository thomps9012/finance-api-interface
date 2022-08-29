import Link from 'next/link'
import styles from '../styles/Home.module.css'


export default function Landing() {
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
        <a><h3>Active Requests</h3></a>
      </Link>
      <Link href={'/mileage/report'}>
        <a><h3>Reports</h3></a>
      </Link>
      <h2>Petty Cash</h2>
      <hr />
      <Link href={'/me/pettyCash'}>
        <a><h3>Active Requests</h3></a>
      </Link>
      <Link href={'/petty_cash/report'}>
        <a><h3>Reports</h3></a>
      </Link>
      <h2>Check Requests</h2>
      <hr />
      <Link href={'/me/checkRequests'}>
        <a><h3>Active Requests</h3></a>
      </Link>
      <Link href={'/check_request/report'}>
        <a><h3>Reports</h3></a>
      </Link>
    </div>
  </main>
}


