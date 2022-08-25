import type { GetServerSidePropsContext, NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const sessionData = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )
  const user = sessionData?.user
  
  console.log("sessionData \n", sessionData)
  return {
    props: {
      userdata: sessionData ? user : null
    }
  }
}

const Home: NextPage = ({ userdata }: any) => {

  return (
    <div className={styles.container}>
      <pre>{JSON.stringify(userdata, null, 2)}</pre>
      <h1>Welcome to the Finance Request Hub</h1>
    </div>
  )
}

export default Home
