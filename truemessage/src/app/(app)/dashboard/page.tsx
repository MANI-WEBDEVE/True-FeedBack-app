'use client';

import MessageCard from '@/components/MessafeCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/models/User.model';
import { AcceptMessageSchema } from '@/Schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
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
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description: axiosError.response?.data.message || 'Failed to fetch messages',
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
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Something went wrong',
        variant: 'destructive',
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
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong while deleting the message.',
        variant: 'destructive',
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
    return <div>Loading...</div>;
  }

  // User not authenticated
  if (!session || !session.user) {
    return (
      <div className="h-full text-5xl flex items-center justify-center font-bold text-purple-500">
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
          messages.map((message, index) => (
            <MessageCard key={index} message={message} onMessageDelete={handleDeleteMessage} />
          ))
        ) : (
          <p>No messages to display</p>
        )}
      </div>
    </div>
  );
}

export default Page;

/*
'use client'
 import MessageCard from '@/components/MessafeCard';
 import { Button } from '@/components/ui/button';
 import { Separator } from '@/components/ui/separator';
 import { Switch } from '@/components/ui/switch';
 import { useToast } from '@/hooks/use-toast';
 import { Message } from '@/models/User.model'
 import { acceptingMessageschema } from '@/Schemas/acceptingMessageschema';
 import { ApiResponse } from '@/types/ApiResponse';
 import { zodResolver } from '@hookform/resolvers/zod';
 import axios, { AxiosError } from 'axios';
 import { Loader2, RefreshCcw } from 'lucide-react';
 import { User } from 'next-auth';
 import { useSession } from 'next-auth/react';
 import React, { useCallback, useEffect, useState } from 'react'
 import { useForm } from 'react-hook-form';

  function page() {
    const [messages, setMessages] = useState<Message[]>([]); 
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSwitch, setIsSwitch] = useState<boolean>(false);  
    const {toast} = useToast();

  
   const handleDeleteMessage = (messageId: string) => {
    Filter the messages in state to remove the message with the matching id
   const newMessages = messages.filter((messages) => messages._id !== messageId);
    Set the new list of messages back into state
   setMessages(newMessages);
 };

 const {data: session} = useSession();

 const form = useForm({
   resolver: zodResolver(acceptingMessageschema),
 })

 const { register, watch, setValue } = form;
 const acceptingMessages = watch('acceptingMessages');

 const fetchAcceptMessage = useCallback(async ( ) => {
     setIsSwitch(true);
     try {
       const response = await axios.get<ApiResponse>('/api/acceptingMessages');
       setValue("acceptingMessages", response.data.isAcceptingMessages)
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
       acceptingMessages : !acceptingMessages,
     })
     setValue('acceptingMessages', !acceptingMessages )
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
     <h1 className='text-4xl font-bold mb-4'>User page</h1>
     <div className='mb-4'>
       <h2 className='text-lg font-semibold mb-2'> Copy Your Unique Link</h2>
       <div className=' flex items-center'>
         <input type="text" value={profileUrl} disabled className='input input-bordered w-full p-2 mr-2'/>
         <Button onClick={handleClipBoard} >Copy</Button>
       </div>
     </div>

     <div className='mb-4'>
       <Switch 
       {...register("acceptingMessages")}
       checked={acceptingMessages}
       onCheckedChange={handleSwitchChange}
       disabled={isSwitch}
       />
       <span className='ml-2'>
         Accept Messages: {acceptingMessages ? "ON" : "OFF"}
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

export default page


*/