import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SIGN_IN } from '../../../graphql/mutations';
import client from "../../../graphql/client";

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
            const res = await client.mutate({ mutation: SIGN_IN, variables: { name: user.name, email: user.email, id: user.id } });
            user.token = res.data.sign_in
            console.log(user.token)
            console.log('response', res)
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token = { Authorization: user.token }
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