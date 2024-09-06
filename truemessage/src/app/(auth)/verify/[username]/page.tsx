"use client"
import { useToast } from '@/hooks/use-toast';
import { VerifySchema } from '@/Schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const verifyAcount = () => {

    const router = useRouter();
    const params = useParams<{username: string}>(); 
    const { toast } = useToast()

    // zod implementation
    const form = useForm<z.infer<typeof VerifySchema>>({
        resolver: zodResolver(VerifySchema)
    })

    const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            })
            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace('/sign-in')
        } catch (error) {
            console.log(`Something went wrong: ${error}` );
            const errorMessage = error as AxiosError<ApiResponse>;
            toast({
                title: "verification Failed",
                description: errorMessage.response?.data.message,
                variant:"destructive"
            })
        }
    }
 
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-600/20'>
      <div className='w-full max-w-md space-y-8  p-8 bg-white rounded-lg shadow-2xl'>
      <div className="text-center ">
            <h1 className="text-4xl tracking-tighter font-extrabold mb-4 text-center min-[344px]:text-3xl ">Join <span className="text-purple-600">TRUE-</span> Messages</h1>
            <p className="text-center tracking-tighter mb-4">Enter Your <span className='text-purple-600'>Verification</span> Code</p>
          </div>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter Verification Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='bg-purple-600' type="submit">Submit</Button>
      </form>
    </Form>
      </div>
    </div>
  )
}

export default verifyAcount
