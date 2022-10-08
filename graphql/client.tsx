import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
    uri: "https://default-20220902t121147-sr3vwdfovq-uc.a.run.app/graphql"
})
const createClient = (context: any) => {
    console.log('client context', context)
    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                Authorization: context ? context : "",
            }
        }
    });
    return new ApolloClient({
        link: authLink.concat(httpLink),
        ssrMode: typeof window === 'undefined',
        cache: new InMemoryCache()
    });
}

export default createClient;