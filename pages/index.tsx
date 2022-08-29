import type { GetServerSidePropsContext } from 'next'
import { unstable_getServerSession } from "next-auth"
import { authOptions } from './api/auth/[...nextauth]'
import { gql } from "@apollo/client"
import createClient from '../graphql/client'
import { UserOverview } from '../types/users'
import dateFormat from '../utils/dateformat'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const sessionData = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )
  const jwt = sessionData?.user.token
  const client = createClient(jwt);
  const GET_MY_INFO = gql`query me {
        me {id, name, last_login, incomplete_actions {request_type, request_id, status, created_at}, incomplete_action_count, role }}`
  const res = await client.query({ query: GET_MY_INFO })
  return {
    props: {
      userdata: sessionData ? res.data.me : null
    }
  }
}

export default function Home({ userdata }: { userdata: UserOverview }) {

  return <main className={styles.main}>
    <div className={styles.container}>
      <h1>Welcome to the Finance Request Hub</h1>
      <h1>{userdata.name}</h1>
      <Link href={'/me/inbox'}>
        <a>
          <h2>You have {userdata.incomplete_action_count} Notifications</h2>
        </a>
      </Link>
      <h2>Since your Last Login on {dateFormat(userdata.last_login)}</h2>
    </div>
  </main>
}


