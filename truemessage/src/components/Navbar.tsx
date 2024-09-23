"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const usernamePro = user?.username?.split("")[0].toUpperCase() || user?.email;
  return (
    <header className=" flex justify-center items-center ml-3 bg-gray-100  ">
      <nav className="w-full bg-gray-200 p-6 backdrop-blur-2xl  flex justify-between  items-center gap-  md:p-4 mt-4 mr-6 rounded-full shadow-2xl ">
        <Link href="#">
          <h1 className="text-3xl  hover:scale-110 duration-500 transition-all  hover:font-bold">
            <span className="text-purple-600">True</span>Message
          </h1>
        </Link>
        <div className="mr-4 ">
          {session ? (
            <>
              <div className="text-xl font-medium text-purple-600 tracking-tighter  flex items-center gap-4">
                <Button
                  onClick={() => signOut()}
                  className="text-sm font-light rounded-lg  bg-purple-600"
                >
                  LogOut
                </Button>
                <span className="px-4  py-3  rounded-[50px] border-[1px] border-purple-600">
                  <span className="text-3xl font-semibold ">{usernamePro}</span>
                </span>
              </div>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className=" bg-purple-600 font-bold rounded-lg px-4 py-2  transition-all hover:bg-purple-500 hover:scale-110 duration-500 ease-in-out">
                LogIn
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
