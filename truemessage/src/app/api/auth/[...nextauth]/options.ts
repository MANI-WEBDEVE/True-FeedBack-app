import dbConnect from "@/lib/dbConnect";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User.model";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter Your Email or Username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter Your Password",
        },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            console.error("User not found");
            return null; // Return null instead of throwing an error
          }

          if (!user.isVerify) {
            console.error("Email not verified");
            return null; // Return null if the email is not verified
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            console.log("logouser",user);
            return user; // Return the user if the password matches
          } else {
            console.error("Invalid password");
            return null; // Return null if the password is incorrect
          }
        } catch (err: any) {
          console.error("Authorization error:", err.message);
          return null; // Return null in case of any error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerify = user.isVerify;
        token.username = user.username;
        token.isAcceptingMessage = user.isAcceptingMessage;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerify = token.isVerify;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
