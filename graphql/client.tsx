import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
    uri: process.env.GRAPHQL_URI
})
const createClient = async (context: any) => {
    console.log('client context', context)
    const authLink = setContext(async (_, { headers }) => {
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