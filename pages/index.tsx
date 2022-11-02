import { useSession } from 'next-auth/react'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import jwtDecode from 'jwt-decode'
import { gql } from '@apollo/client'
import { GetServerSidePropsContext } from 'next'
import { unstable_getServerSession } from 'next-auth'
import createClient from '../graphql/client'
import { authOptions } from './api/auth/[...nextauth]'
import dateFormat from '../utils/dateformat'
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const sessionData = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )
  const jwt = sessionData?.user.token
  if (jwt) {
    const client = createClient(jwt);
    const GET_NOTIFICATIONS = gql`query me {
        me {
          incomplete_action_count
          last_login 
        }
  }`
    const res = await client.query({ query: GET_NOTIFICATIONS })
    return {
      props: {
        notifications: res.data.me.incomplete_action_count,
        last_login: res.data.me.last_login
      }
    }
  } else {
    return {
      props: {
        notifications: 0,
        last_login: ""
      }
    }
  }
}
export default function Landing({ notifications, last_login }: { notifications: number, last_login: string }) {
  const session = useSession()
  const user_token: { permissions: string[] } = jwtDecode(session?.data?.user.token)
  const user_permissions = user_token?.permissions;
  console.log('role', user_permissions)
  return <main className={styles.landing}>
    <div className={styles.container}>
      <header style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <h1>Finance Request Hub</h1>
        <Link href={'/me/inbox'}>
          <a><h2>{notifications} New Action Items</h2><h2>Since {dateFormat(last_login)}</h2></a>
        </Link>
      </header>
      <br />
      <h2>🚗 Mileage </h2>
      <hr />
      <Link href={'/mileage/create'}>
        <a><h3>New Request</h3></a>
      </Link>
      <Link href={'/mileage'}>
        <a>
          <h3>All Actions</h3>
        </a>
      </Link>
      <br />
      <h2>💸 Petty Cash </h2>
      <hr />
      <Link href={'/petty_cash/create'}>
        <a><h3>New Request</h3></a>
      </Link>
      <Link href={'/petty_cash'}>
        <a>
          <h3>All Actions</h3>
        </a>
      </Link>
      <br />
      <h2>📑 Check Requests </h2>
      <hr />
      <Link href={'/check_request/create'}>
        <a><h3>New Request</h3></a>
      </Link>
      <Link href={'/check_request'}>
        <a>
          <h3>All Actions</h3>
        </a>
      </Link>
      <br />
      {user_permissions.find(() =>"ADMIN") != undefined && <>
        <h2>👨‍👦‍👦 Users </h2>
        <hr />
        <Link href={'/users'}>
          <a>
            <h3>View All</h3>
          </a>
        </Link>
      </>
      }
    </div>
  </main>
}


