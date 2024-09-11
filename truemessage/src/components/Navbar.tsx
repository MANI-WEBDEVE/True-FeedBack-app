"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <div className="w-full  flex justify-center items-center ml-3">
      <div className="w-full p-6 bg-gray-300/80 flex justify-between  items-center gap-  md:p-4 mt-4 mr-6 rounded-full shadow-2xl">
        <div>
          <Link href="#">
            <h1 className="text-3xl  hover:scale-110 duration-500 transition-all  hover:font-bold">
              <span className="text-purple-600">True</span>Message
            </h1>
          </Link>
        </div>
        <div className="mr-4 ">
          {session ? (
            <>
              <div className="text-xl font-medium text-purple-600 tracking-tighter ">
                <span className="text-black">Welcome</span>{" "}
                {user?.username || user?.email}
              </div>
              <div>
                <Button onClick={() => signOut()} className="text-xl font-bold rounded-lg px-4 py-2 bg-purple-600">LogOut</Button>
              </div>
            </>
          ) : (
            <div className="">
              <Link href="/sign-in">
                <Button className=" bg-purple-600 font-bold rounded-lg px-4 py-2  transition-all hover:bg-purple-500 hover:scale-110 duration-500 ease-in-out">LogIn</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>

  );
}

export default Navbar;
