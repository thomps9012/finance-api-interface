import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import Layout from '../components/layout';
import { setContext } from '@apollo/client/link/context';


const httpLink = createHttpLink({
  uri: "https://agile-tundra-78417.herokuapp.com/graphql/",

})

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      Authorization: token ? token : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache,
  ssrMode: true
})

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  return <ApolloProvider client={client}>
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  </ApolloProvider>
}

export default MyApp
