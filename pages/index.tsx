import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useSession } from "next-auth/react"


const Home: NextPage = () => {
  const session = useSession();
  sessionStorage.setItem("authToken", session?.data?.Authorization as string)
  return (
    <div className={styles.container}>
      <h1>Welcome to the Finance Request Hub</h1>
    </div>
  )
}

export default Home
