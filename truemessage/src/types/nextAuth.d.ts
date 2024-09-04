import { Types } from "mongoose";
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerify?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
    success?: boolean;
    meessage?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerify?: boolean;
      isAcceptingMessage?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerify?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
}
