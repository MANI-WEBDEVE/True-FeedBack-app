import dbConnect from "@/lib/dbConnect";
import { NextAuthOptions, Session } from "next-auth";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User.model";
import CredentialsProvider from "next-auth/providers/credentials";
import { Types } from "mongoose";
import { JWT } from "next-auth/jwt";



interface Credentials {
    identifier: string;
    password: string
}

interface User  extends Document {
    _id: Types.ObjectId;
    username: string;
    email:string;
    password:string; 
    isVerify: boolean;
    isAcceptingMessage:boolean;

}

export const authOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter Your Email" },
        password: { label: "Password", type: "password", placeholder: "Enter Your Password" },
      },
      async authorize(credentials:any):Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("User is Not Found 4O4");
          }
          if (!user.isVerify) {
            throw new Error("Verification your Email is first");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Invalid Password Check You Password");
          }
        } catch (err: any) {
          throw new Error(err.message);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: {session: Session, token: JWT}) {
        if (token) {
           session.user._id = token._id;
           session.user.isVerify = token.isVerify;
           session.user.isAcceptingMessage = token.isAcceptingMessage;
           session.user.username = token.username;
        }
        return session
    },
    async jwt ({ token, user, }){
        if (user) {
            token._id = user._id;
            token.isVerify = user.isVerify;
            token.username = user.username;
            token.isAcceptingMessage = user.isAcceptingMessage;
        }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
