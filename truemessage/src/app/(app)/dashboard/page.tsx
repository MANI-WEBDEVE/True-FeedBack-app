'use client';

import MessageCard from '@/components/MessafeCard';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/models/User.model';
import { AcceptMessageSchema } from '@/Schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';

import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, X } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { unknown } from 'zod';


type MessageObj = {
  content: string;
  timestamp: Date;
};

function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitch, setIsSwitch] = useState<boolean>(false);
  const [firstMessage, setFirstMessage] = useState(true)
  const { toast } = useToast();


  const { data: session, status } = useSession();
 
  // if (status === 'unauthenticated') {
  //   router.push('/login');
  // }
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptingMessages = watch('acceptingMessages');

  // Fetch the message acceptance setting
  // Fetch the message acceptance setting
const fetchAcceptMessage = useCallback(async () => {
  setIsSwitch(true);
  try {
    const response = await axios.get<ApiResponse>('/api/accept-messages');
    setValue('acceptingMessages', response.data.isAcceptingMessages); // Corrected the field name here
    console.log(response.data.isAcceptingMessages); // Corrected the field name here
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    toast({
      title: 'Error',
      description: axiosError.response?.data.message || 'Failed to fetch message settings',
      variant: 'destructive',
      style: {
        color: "black",
        backgroundColor: "white",
        border: "1px solid black",

      }
    });
  } finally {
    setIsSwitch(false);
  }
}, [setValue, toast]);

  //setValue, toast

  // Fetch all messages
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        const messageData = Array.isArray(response.data.message) 
        ? response.data.message 
        : [];

      setMessages(messageData);
        if (refresh) {
          toast({
            title: 'Messages Refreshed',
            description: 'Showing latest messages...',
            style: {
              color: "black",
              backgroundColor: "white",
              border: "1px solid black",
  
            }
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description: axiosError.response?.data.message || 'Failed to fetch messages',
          style: {
            color: "black",
            backgroundColor: "white",
            border: "1px solid black",

          }
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Handle the switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post('/api/accept-messages', {
        acceptingMessages: !acceptingMessages,
      });
      console.log(response.data);
      setValue('acceptingMessages', !acceptingMessages);
      toast({
        title: response.data.message,
        variant: 'default',
        style: {
          color: "black",
          backgroundColor: "white",
          border: "1px solid black",

        }
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Something went wrong',
        variant: 'destructive',
        style: {
          color: "black",
          backgroundColor: "white",
          border: "1px solid black",

        }
      });
    }
  };

  // Handle the delete message action
  const handleDeleteMessage = (messageId: string) => {
    try {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
      toast({
        title: 'Message deleted',
        description: 'The message has been successfully deleted.',
        style: {
          color: "black",
          backgroundColor: "white",
          border: "1px solid black",

        }
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong while deleting the message.',
        variant: 'destructive',
        style: {
          color: "black",
          backgroundColor: "white",
          border: "1px solid black",

        }
      });
    }
  };
  

  // Handle copy to clipboard
  const handleClipBoard = () => {
    const baseUrl = window.location.origin;
    const profileUrl = `${baseUrl}/u/${user.username || 'unknown'}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL copied',
      description: 'Profile URL has been copied',
        style: {
            color: "black",
            backgroundColor: "white",
            border: "1px solid black",

          }
    });
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAcceptMessage();
      fetchMessages();
    }
  }, [status, fetchAcceptMessage, fetchMessages]);
  // status, fetchAcceptMessage, fetchMessages
  // Loading state while session is being fetched
  if (status === 'loading') {
   return  <div className="h-[100vh]  flex items-center justify-center font-bold text-purple-500">
        <div className="h-full w-full flex items-center justify-center flex-col gap-3 ">
          <div className="animate-spin rounded-full h-5 w-5 border-b-4 p-12 border-purple-500"></div>
          <p className="text-xl font-thin text-purple-500">Loading</p>
        </div>
      </div>
  }

  // User not authenticated
  if (!session || !session.user) {
    return (
      <div className="h-[100vh] text-5xl flex items-center justify-center font-bold text-purple-500">
        Please Login First
      </div>
    );
  }

  // Extract user info from session
  const user = session?.user as User;
  if (!user || !user.username) {
    return <div>User data not found. Please try again later.</div>;
  }
  

  // Return the actual page content
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-gray-100 rounded w-full max-w-6xl h-full">
      <h1 className="text-4xl font-bold mb-4"><span className='text-purple-600'>User</span> Dashboard</h1>

      {/* Unique Link Copy Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={`${window.location.origin}/u/${user.username}`}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={handleClipBoard}>Copy</Button>
        </div>
      </div>

      {/* Accept Messages Switch */}
      <div className="mb-6">
        <Switch
          {...register('acceptingMessages')}
          checked={acceptingMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitch}
        />
        <span className="ml-2">Accept Messages: {acceptingMessages ? 'ON' : 'OFF'}</span>
      </div>

      <Separator />

      {/* Refresh Messages Button */}
      <Button className="mt-4" variant="outline" onClick={() => fetchMessages(true)}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
      </Button>

      {/* Messages Display */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message:any, index) => (
            <MessageCard key={message.id} message={message} onMessageDelete={handleDeleteMessage} />
          ))
        ) : (
         firstMessage ? (<>
          <Card className="bg-gray-300">
          <CardHeader>
          
            <AlertDialog>
              <AlertDialogTrigger asChild >
                <div className="flex justify-end items-center">
                <Button variant="outline" className="w-[65px] bg-red-300 hover:bg-red-500"><X className="w-5 h-5"/></Button>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent className="text-white bg-black">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-purple-500">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-black">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => setFirstMessage((prev) => !prev)} className="bg-purple-500">Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <CardTitle className="uppercase text-2xl"><span className="text-purple-600 font-thin ">True</span> <span className="text-purple-600 font-light ">Messages</span> For <span className="text-purple-600 font-thin ">You</span></CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-start font-nedium text-xl">
            <p>WelCome User True Messages</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-purple-500">TrueMessage@dev</p>
          </CardFooter>
        </Card>


         </>) : (<>No Message Found</>)
        )}
      </div>
    </div>
  );
}

export default Page;
