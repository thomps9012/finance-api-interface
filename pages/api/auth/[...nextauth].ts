import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import MyAdapter from './adapter'

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        })
    ],
    events: {
        async signIn({ user }) {
            console.log('user from event', user)
        }
    },
    // adapter: MyAdapter(),
    callbacks: {
        async signIn({ user, account, profile }) {
            profile.hd != 'norainc.org' && false;
            console.log('user', user)
            console.log('account', account)
            console.log('profile', profile)
            return true
        }
    }
}

export default NextAuth(authOptions);