import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SIGN_IN } from '../../../graphql/mutations';
import createClient from "../../../graphql/client";
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
            return true
            const client = createClient("");
            console.log('email:', user.email)
            console.log('id:', user.id)
            console.log('name:', user.name)
            const res = await client.mutate({ mutation: SIGN_IN, variables: { name: user.name, email: user.email, id: user.id } });
            console.log('user token', user.token)
            user.token = res.data.sign_in
            console.log('signin res', res)
            if (!res) {
                console.log('error')
                console.error('trouble sign in');
                return false
            } else {
                console.log('success')
                return true
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.Authorization = user.token
            }
            return token;
        },
        async session({ session, token, user }) {
            session.Authorization = token.Authorization;
            return session;
        }
    }
}

export default NextAuth(authOptions);