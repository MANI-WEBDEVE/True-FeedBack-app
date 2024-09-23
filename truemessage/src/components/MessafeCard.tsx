"use client"
import {
  Card,
  CardContent,
  CardDescription,
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


interface MessageCardProp {
    message : Message;
    onMessageDelete : (messageId: string) => void
}


import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/User.model";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { ApiResponse } from "@/types/ApiResponse";
export default function MessageCard({message , onMessageDelete}: MessageCardProp) {
    const { toast } = useToast()

    /**
     * Handles the deletion of a message
     *
     * @returns {Promise<void>}
     */
    const handleMessageDelete = async (): Promise<void> => {
       try {
        
         const response = await axios.delete(`/api/delete-messages/${message._id}
         `);
         console.log(response.data)
      
         toast({
             title: response.data.message,
             variant: "destructive",
             style: {
              color: "black",
              backgroundColor: "white",
              border: "1px solid black",
  
            }
         });
       } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         toast({
             title: "Error",
             description: axiosError.response?.data.message || "Something went wrong",
             variant: "destructive",
             style: {
              color: "black",
              backgroundColor: "white",
              border: "1px solid black",
  
            }
         });
       }
       
     
        onMessageDelete(message._id as string) ;

    };

    const {data: session} = useSession();
    const username = session?.user.username;
    const email = session?.user.email;

  return (
    <Card className="bg-gray-300">
      <CardHeader>
      
        <AlertDialog>
          <AlertDialogTrigger asChild >
            <div className="flex justify-end items-center">
            <Button variant="outline" className="w-[65px] "><X className="w-5 h-5"/></Button>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleMessageDelete()} >Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <CardTitle className="uppercase text-2xl"><span className="text-purple-600 font-thin ">True</span> <span className="text-purple-600 font-light ">Messages</span> For <span className="text-purple-600 font-thin ">You</span></CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-start font-nedium text-xl">
        <p>{message.content}</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-purple-500">{email}</p>
      </CardFooter>
    </Card>
  );
}
