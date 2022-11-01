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
            console.log('user email: ', user.email)
            console.log('user name: ', user.name)
            console.log('image:', user.image)
            console.log('user id:', user.id)
            const api_route = `https://default-20220902t090710-sr3vwdfovq-uc.a.run.app/graphql?query=mutation+_{login(id: "${user.id}", email:"${user.email}", name:"${user.name}")}`
            console.log(api_route)
            const json = await fetch(api_route).then(res => res.json())
            console.log(json)
            if (json) {
                user.token = json.data.login
                console.log('api json', json.data.login)
                console.log('user token', user.token)
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