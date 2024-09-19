"use client"
import { SessionProvider } from "next-auth/react"
// import React, { ReactNode } from "react"

export default function AuthProvider({
  children,
  
}: Readonly<{children: React.ReactNode}>){
  return (
    <SessionProvider >
     {children}
    </SessionProvider>
  )
}