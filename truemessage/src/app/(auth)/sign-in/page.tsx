"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceValue } from 'usehooks-ts'
import Link from "next/link"
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { SignUpSchema } from "@/Schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const SignIn = () => {
  const { toast } = useToast()
  const [userName, setUserName] = useState<string>('');
  const [userNameMessage, setUserNameMessage] = useState<string>('');
  const [isCheckingUserName, setIsCheckingUserName] = useState<boolean>(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false)

  const router = useRouter()

  const userNameValue = useDebounceValue(userName, 500);
  const toaster = () => {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    })
  }

  // zod implementation
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }


  })
  // useEffect(() => {
  //   const handleCheckUniqueUserName = async () => {
  //     if (userNameValue) {
  //       setIsCheckingUserName(true);
  //       setUserNameMessage("");
  //       try {
  //         const response = await axios.get(`/api/check-username-unique?username=${userNameValue}`);
  //         setUserNameMessage(response.data.message)
  //       } catch (error) {
  //         const axiosError = error as AxiosError<ApiResponse>
  //         setUserNameMessage(axiosError.response?.data.message ?? "Internal Server Error")
  //       } finally {
  //         setIsCheckingUserName(false)
  //       }
  //     }
  //   }
  //   handleCheckUniqueUserName()
  // }, [userNameValue])

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
      const errorMessage = await axiosError.response?.data.message;
      toast({
        variant: "destructive",
        title: "Uh oh! Sign Up Failed",
        description: errorMessage,
      })
      setIsSubmiting(false)
    }
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
              <FormControl>
                <Input placeholder="Enter Your Username" {...field} onChange={(e) => {field.onChange(e), setUserName(e.target.value)}} />
              </FormControl>
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
                <Input placeholder="Enter Your Email address" {...field} />
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
              <FormControl>
                <Input placeholder="Enter Your Password" {...field} onChange={(e) => {field.onChange(e), setUserName(e.target.value)}} />
              </FormControl>
              <FormDescription>
              Please enter strong password. Your Password should be 8 character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
              </form>
          </Form>
        </div>

      </div>

    </>
  )
}


export default SignIn
