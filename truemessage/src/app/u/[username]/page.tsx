"use client";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";

const ProfilePage = () => {
  const [messageContent, setMessageContent] = useState<string>("");
  const [userAcceptMessage, setUserAcceptMessage] = useState<boolean | undefined>();
  const { toast } = useToast();

  const username = window.location.pathname.split("/")[2];

  const handleUserAcceptMessage = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/user-accept-message", { username });
      setUserAcceptMessage(response.data.userAcceptMessage);
      
      if (response.data.userAcceptMessage) {
        toast({ title: "User Accepted Message" });
      } else {
        toast({ title: "User Did Not Accept Message" });
      }
    } catch (error) {
      console.log(error);
      const axiosErro = error as AxiosError<ApiResponse>;
      toast({ title: "Error fetching user acceptance", description: axiosErro.response?.data.message });
    }
  };

  useEffect(() => {
    handleUserAcceptMessage();
  }, []);

  const sendMessageApi = async () => {
    if (!messageContent.trim()) {
      toast({ title: "Message cannot be empty" });
      return;
    }
    try {
      const response = await axios.post("/api/send-messages", { username, content: messageContent });
      console.log(response.data);
      toast({ title: "Message sent successfully!" });
    } catch (error: any) {
      console.log(error.message);
      toast({ title: "Error sending message", description: error.message });
    }
  };

  return (
    <>
      <main className="h-[110vh] w-full bg-gray-100">
        <Navbar />
        <div className="mt-[3rem]">
          <h1 className="text-4xl font-semibold text-center uppercase">
            Public{" "}
            <span className="text-purple-600 font-thin">Profile Page</span>
          </h1>
        </div>
        <div className="w-1/2 mx-auto mt-8">
          <Label>
            Send Anonymous Message to{" "}
            <span className="text-medium text-lg font-normal text-purple-600 uppercase">
              {username}
            </span>
          </Label>
        </div>
        <div className="w-1/2 mx-auto mt-2">
          <Input
            placeholder="Enter Your Message"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
        </div>
        <div className="w-1/2 mx-auto mt-2">
          <Button
            onClick={sendMessageApi}
            className="bg-purple-600 font-bold text-black px-4 py-2 hover:bg-purple-500 transition-all hover:scale-110 duration-500 uppercase"
          >
            Send It
          </Button>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
