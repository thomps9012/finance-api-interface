import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.PUBLIC_GOOGLE_ID as string,
            clientSecret: process.env.PUBLIC_GOOGLE_SECRET as string,
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            const api_route = process.env.PUBLIC_GRAPHQL_URI + `?query=mutation+_{sign_in(email:"${user.email}", name:"${user.name}")}`
            const json = await fetch(api_route).then(res => res.json())
            if (json) {
                user.token = json.data.sign_in
                return true
            }
            return false
        },
        async jwt({ token, user }) {
            if (user) {
                token.Authorization = user.token
            }
            return token;
        },
        async session({ session, token, user }) {
            console.log('rendering app')
            session.user.token = token.Authorization
            return session;
        }
    }
}

export default NextAuth(authOptions);