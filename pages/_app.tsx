import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react';
import { setContext } from '@apollo/client/link/context';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  from
} from '@apollo/client';
import Layout from '../components/layout';

const httpLink = createHttpLink({
  uri: "https://agile-tundra-78417.herokuapp.com/graphql",
  credentials: "include"
})


const authLink = setContext(async (_, { headers }: { headers: Headers }) => {
  // const session = await getSession();
  // console.log('header auth', session)
  return {
    headers: {
      ...headers,
      // Authorization: session?.Authorization ? session.Authorization : "",
    }
  }
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache,
  ssrMode: true
})

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return <SessionProvider session={session}>
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  </SessionProvider>
}

export default MyApp
