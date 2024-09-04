"use client"
import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

export default function AuthProvider({
  children,
  
}: Readonly<{children: ReactNode}>){
  return (
    <SessionProvider >
     {children}
    </SessionProvider>
  )
}