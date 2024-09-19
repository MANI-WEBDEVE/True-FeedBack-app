'use client'
import MessageCard from '@/components/MessafeCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/models/User.model'
import { AcceptMessageSchema } from '@/Schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitch, setIsSwitch] = useState<boolean>(false);
  const {toast} = useToast();

  /**
   * This function is called when the user clicks the delete button next to a message
   * in the list of messages. It takes the id of the message to be deleted as an argument.
   * It then filters the messages in state to remove the message with the matching id
   * and sets the new list of messages back into state.
   * @param {string} messageId - The id of the message to be deleted
   */
  const handleDeleteMessage = (messageId: string) => {
    // Filter the messages in state to remove the message with the matching id
    const newMessages = messages.filter((messages) => messages._id !== messageId);
    // Set the new list of messages back into state
    setMessages(newMessages);
  };

  const {data: session} = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  })

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async ( ) => {
      setIsSwitch(true);
      try {
        const response = await axios.get<ApiResponse>('/api/acceptMessages');
        setValue("acceptMessages", response.data.isAcceptingMessages)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
          title: "Error",
          description: axiosError.response?.data.message || "Failed to fetch message settings" ,
          variant: "destructive"
        })
      } finally {
        setIsSwitch(false)
      }

  }, [setValue])

  const fetchMessages = useCallback(async (refresh : boolean = false) => {
    setIsLoading(true);
    setIsSwitch(true)
    try {
      const response = await axios.get('/api/get-messages')
      setMessages(response.data.messages || []);
      if (refresh){
        toast({
          title: "refresh Messages",
          description: "Show latest Messages ..."
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Request Something failed Please Try later"
      })
    } finally {
      setIsLoading(false)
      setIsSwitch(false)
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {
    if (!session || !session.user) return 
    fetchAcceptMessage()
    fetchMessages()
  }, [setValue, session, fetchAcceptMessage, fetchMessages])

  // handle switch change;
  const handleSwitchChange = async ()=> {
    try {
      const response = await axios.post("/api/accept-messages", {
        acceptMessages : !acceptMessages,
      })
      setValue('acceptMessages', !acceptMessages )
      toast({
        title: response.data.message,
        variant: "destructive"
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Some went wrong",
        variant: "destructive"
      })
    }
  }

  // username extract 
  
  const { username  } = session?.user as User;
  const baseUrl = window.location.origin;
  const profileUrl = `${baseUrl}/u/${ username }`

  // handle Clipboard
  const handleClipBoard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied",
      description: "Url has been copy"
    })
  }

  if (!session || !session.user) {
    return <>
    <h1 className='h-full text-5xl flex items-center justify-center font-bold text-purple-500'>Please Login First</h1>
    </>
  }

  return ( 
    <div className="my8 mx-4 md:mx-8 lg:mx-quto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className='text-4xl font-bold mb-4'>User DashBoard</h1>
      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'> Copy Your Unique Link</h2>
        <div className=' flex items-center'>
          <input type="text" value={profileUrl} disabled className='input input-bordered w-full p-2 mr-2'/>
          <Button onClick={handleClipBoard} >Copy</Button>
        </div>
      </div>

      <div className='mb-4'>
        <Switch 
        {...register("acceptMessages")}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitch}
        />
        <span className='ml-2'>
          Accept Messages: {acceptMessages ? "ON" : "OFF"}
        </span>
      </div>
      <Separator/>
      <Button className='mt-4' variant="outline" onClick={(e) => {e.preventDefault(); fetchMessages(true)}}>
        {
          isLoading ? (<Loader2 className='h-4 w-4 animate-spin'/>) : (<RefreshCcw className='h-4 w-4'/>)
        }
      </Button>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
      {
        messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard 
            key={message._id as string}
            message={message}
            onMessageDelete={handleDeleteMessage}
            />
          ))
          
        ) : (
          <p>No Message To display</p>
        )
        
      }  
      </div> 
    </div>
  )
}

export default Dashboard
