import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink
} from '@apollo/client';
import Layout from '../components/layout';

const httpLink = createHttpLink({
  uri: "https://agile-tundra-78417.herokuapp.com/graphql",
  credentials: 'same-origin'
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache,
  ssrMode: true
})

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // possible lexical scope issue here for jwt auth
  return <ApolloProvider client={client}>
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  </ApolloProvider>
}

export default MyApp
