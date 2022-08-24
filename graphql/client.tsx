import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
    uri: "https://agile-tundra-78417.herokuapp.com/graphql/"
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