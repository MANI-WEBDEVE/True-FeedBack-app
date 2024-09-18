'use client'
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/models/User.model'
import { AcceptMessageSchema } from '@/Schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
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
  const handleDelete = (messageId: string) => {
    // Filter the messages in state to remove the message with the matching id
    const newMessages = messages.filter((messages) => messages._id !== messageId);
    // Set the new list of messages back into state
    setMessages(newMessages);
  };

  const {data: session} = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  })

  return ( 
    <div>
      Dashboard
    </div>
  )
}

export default Dashboard
