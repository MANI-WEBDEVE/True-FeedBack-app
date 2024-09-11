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
    onMessageDelete : (message: string) => void
}


import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/User.model";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
export default function MessageCard({message , onMessageDelete}: MessageCardProp) {
    const { toast } = useToast()

    /**
     * Handles the deletion of a message
     *
     * @returns {Promise<void>}
     */
    const handleMessageDelete = async (): Promise<void> => {
        /**
         * Delete the message by sending a DELETE request to the server
         */
        const response = await axios.delete(`/api/delete-message/${message.id}`);
        /**
         * Toast the message to the user
         */
        toast({
            title: response.data.message,
        });
        /**
         * Call the callback function to delete the message from the parent component
         */
        onMessageDelete(message.id);

    };

  return (
    <Card>-
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline"><X className="w-5 h-5"/></Button>
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
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
