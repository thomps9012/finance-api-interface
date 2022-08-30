import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            profile.hd != 'norainc.org' && false;
            console.log('user id: ', user.id)
            console.log('user email: ', user.email)
            console.log('user name: ', user.name)
            const api_route = `https://agile-tundra-78417.herokuapp.com/graphql?query=mutation+_{sign_in(id:"${user.id}", email:"${user.email}", name:"${user.name}")}`
            const json = await fetch(api_route).then(res => res.json())
            if (json) {
                user.token = json.data.sign_in
                console.log('api json', json.data.sign_in)
                console.log('user token', user.token)
                return true
            }
            return false
        },
        async jwt({ token, user }) {
            if (user) {
                token.Authorization = user.token
                token.id = user.id
            }
            return token;
        },
        async session({ session, token, user }) {
            console.log('rendering app')
            session.user.id = token.id
            session.user.token = token.Authorization
            return session;
        }
    }
}

export default NextAuth(authOptions);