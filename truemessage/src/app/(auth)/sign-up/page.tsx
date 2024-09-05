"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {  useDebounceCallback } from 'usehooks-ts'
import Link from "next/link"
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { SignUpSchema } from "@/Schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";


const SignIn = () => {
  const { toast } = useToast()
  const [userName, setUserName] = useState<string>('');
  const [userNameMessage, setUserNameMessage] = useState<string>('');
  const [isCheckingUserName, setIsCheckingUserName] = useState<boolean>(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
  const [togglePassword, setTogglePassword] = useState<boolean>(false)
  const router = useRouter()

  const debounced = useDebounceCallback(setUserName, 500);
  // const toaster = () => {
  //   toast({
  //     variant: "destructive",
  //     title: "Uh oh! Something went wrong.",
  //     description: "There was a problem with your request.",
  //     action: <ToastAction altText="Try again">Try again</ToastAction>,
  //   })
  // }

  // zod implementation
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }


  })
  useEffect(() => {
    const handleCheckUniqueUserName = async () => {
      if (userName) {
        setIsCheckingUserName(true);
        setUserNameMessage("");
        try {
          const response = await axios.get(`/api/check-username-unique?username=${userName}`);
          setUserNameMessage(response.data.message)
          console.log(response.data)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUserNameMessage(axiosError.response?.data.message ?? "Internal Server Error")
        } finally {
          setIsCheckingUserName(false)
        }
      }
    }
    handleCheckUniqueUserName()
  }, [userName])

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsSubmiting(true);
    try {
      const response = await axios.post('/api/sign-up', data)
      toast({
        title: "Success",
        description: response.data.message
      })
      router.replace(`/verify/${userName}`)
      setIsSubmiting(false)
    } catch (error) {
      console.log(`Error Signup Failed: ${error}`);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =  axiosError.response?.data.message;
      toast({
        variant: "destructive",
        title: "Uh oh! Sign Up Failed",
        description: errorMessage,
      })
      setIsSubmiting(false)
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
            <p className="text-center tracking-tighter mb-4">Lest Sign Up and <span className="text-purple-600 font-medium ">Join Anonymous Messages Advanture.</span></p>
          </div>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <div className="relative">
              <FormControl>
                <Input type="text" placeholder="Enter Your Username" {...field} onChange={(e) => {field.onChange(e), debounced(e.target.value)}} />
              </FormControl>
              <div className="absolute top-2 right-3">
              {isCheckingUserName ? <Loader2 className="animate-spin text-purple-600"/>: ""}
              </div>
              </div>
              {userNameMessage === "User Name is Unique" ? <p className="text-green-500 text-sm">username is unique</p>: <p className="text-red-500 text-xs">username not Unique!</p>}
              <FormDescription>
              Please enter a unique username. Your username should be between 4 to 16 characters long.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter Your Email address" {...field} />
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
          <div className="text-center mt-4 ">
           
            <Link href="/sign-in" className=" text-blue-500 hover:text-blue-700">
            Already a member
            </Link> 
          </div>
        </div>

      </div>

    </>
  )
}


export default SignIn
