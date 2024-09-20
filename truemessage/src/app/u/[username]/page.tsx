"use client"
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import axios from "axios";

const page = () => {
  const [messageContent, setMessageContent] = useState<string>("")

  
  const baseUrl = window.location.pathname;
  const mainUri = baseUrl.split("/")[2]
  const sendMessageApi = async () => {
    try {
      const response = await axios.post("/api/send-messages", { username: mainUri, content: messageContent });
      console.log(response.data);
    } catch (error : any) {
      console.log(error.message)
    }
  }

 


  return <>
  <main className="h-[110vh] w-full bg-gray-100">
  <Navbar/>
  <div className="mt-[3rem]">
    <h1 className="text-4xl font-semibold text-center uppercase">Public <span className="text-purple-600 font-thin">Profile Page </span></h1>
  </div>
  <div className="w-1/2 mx-auto mt-8 ">
    <Label>Send Anonymous Message to <span className="text-medium text-lg font-normal text-purple-600 uppercase">{mainUri}</span></Label>
  </div>
  <div className="w-1/2 mx-auto mt-2">
    <Input placeholder="Enter Your Message" value={messageContent} onChange={(e) => setMessageContent(e.target.value)}/>
  </div>
  <div className="w-1/2 mx-auto mt-2"> 
    <Button onClick={sendMessageApi} className="bg-purple-600 font-bold text-black px-4 py-2 hover:bg-purple-500 transition-all hover:scale-110 duration-500 uppercase">Send It</Button>
  </div>
  </main>
  </>;
};

export default page;
