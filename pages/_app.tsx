import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider, useSession } from 'next-auth/react';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  concat,
  ApolloLink
} from '@apollo/client';
import Layout from '../components/layout';
import { setContext } from '@apollo/client/link/context';


// const httpLink = createHttpLink({
//   uri: "https://agile-tundra-78417.herokuapp.com/graphql"
// })

// const authLink = setContext((headers) => {
//   const { data } = useSession();
//   return {
//     headers: {
//       ...headers,
//       Authorization: data?.user.token ? data.user.token : "",
//     }
//   }
// });

// const client = new ApolloClient({
//   link: concat(authLink, httpLink),
//   cache: new InMemoryCache,
//   ssrMode: typeof window == "undefined"
// })

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return <SessionProvider session={session}>
    {/* <ApolloProvider client={client}> */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    {/* </ApolloProvider> */}
  </SessionProvider>
}

export default MyApp
