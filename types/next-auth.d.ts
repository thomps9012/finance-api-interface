import NextAuth, { DefaultSession } from "next-auth/next";
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            email: string;
            name: string;
            picture: string;
        } & DefaultSession["user"]
    }
    interface User {
        email: string;
        name: string;
        picture: string;
    }
    interface Profile {
        email: string;
        name: string;
        picture: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        idToken?: string;
    }
}

export interface CustomJWT {
    admin: boolean;
    exp: number;
    id: string;
    name: string;
    permissions: string[];
}