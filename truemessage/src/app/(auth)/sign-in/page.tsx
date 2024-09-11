"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {  useState } from "react";
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu"; 
import { SignInSchema } from "@/Schemas/signInSchema"   
import { signIn } from "next-auth/react"


const SignIn = () => {
  const { toast } = useToast()
 
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
  const [togglePassword, setTogglePassword] = useState<boolean>(false)
  const router = useRouter()

  // const toaster = () => {
  //   toast({
  //     variant: "destructive",
  //     title: "Uh oh! Something went wrong.",
  //     description: "There was a problem with your request.",
  //     action: <ToastAction altText="Try again">Try again</ToastAction>,
  //   })
  // }

  // zod implementation
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: ""
    }


  })

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
      setIsSubmiting(true)
       const result = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password
        })
        console.log(result)
        if (result?.error) {
          toast({
            title: "Sign In Failed" ,
            description: "Check your email and password",
            variant: "destructive"
          })
        } 
        setIsSubmiting(false)
        if (result?.url) {
          router.replace("/dashboard")
        }

  }

  const togglePasswordField = () => {
    setTogglePassword(!togglePassword)
  }

  return (
    <>

      <div className="flex justify-center items-center min-h-screen bg-gray-800/10 p-8">
        <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-2xl ">
          <div className="text-center ">
            <h1 className="text-4xl tracking-tighter font-extrabold mb-4 text-center min-[344px]:text-3xl ">Join <span className="text-purple-600">TRUE-</span> Messages</h1>
            <p className="text-center tracking-tighter mb-4">Lest Sign In and <span className="text-purple-600 font-medium ">Join Anonymous Messages Advanture.</span></p>
          </div>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Your Email address or Username" {...field} />
              </FormControl>
              <FormDescription>
              Please enter a Valid Email. Because send the verfiy code your Email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
              <FormControl>
                {   <Input type={togglePassword ? "text": "password"} placeholder="Enter Your Password" {...field}  />  }
              </FormControl>
              <div onClick={togglePasswordField}>
              { togglePassword ? ( <LuEye  className="absolute top-3 right-3"/> ) : (<LuEyeOff className="absolute top-3 right-3"/>) }
              </div>
            
              </div>
              <FormDescription>
              Please enter strong password. Your Password should be 8 character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmiting} className={`${isSubmiting ? "bg-purple-600" : "bg-black"}`}>
          { isSubmiting ? (<>
          <Loader2 className="animate-spin h-4 w-4 mr-2"/> Please wait
          </>) : ("SignIn") }
        </Button>
              </form>
          </Form>
        </div>

      </div>

    </>
  )
}


export default SignIn
