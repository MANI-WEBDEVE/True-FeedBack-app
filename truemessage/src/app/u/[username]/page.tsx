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
  const [userAcceptMessage, setUserAcceptMessage] = useState< boolean | undefined>();
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [suggestedInput, setSuggestedInput] = useState<string>("");
  const { toast } = useToast();

  const username = window.location.pathname.split("/")[2];

  const handleUserAcceptMessage = async () => {
    try {
      const response = await axios.post<ApiResponse>(
        "/api/user-accept-message",
        { username }
      );
      setUserAcceptMessage(response.data.userAcceptMessage);

      if (response.data.userAcceptMessage) {
        toast({ title: "User Accepted Message" });
      } else {
        toast({ title: "User Did Not Accept Message" });
      }
    } catch (error) {
      console.log(error);
      const axiosErro = error as AxiosError<ApiResponse>;
      toast({
        title: "Error fetching user acceptance",
        description: axiosErro.response?.data.message,
      });
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
        const response = await axios.post("/api/send-messages", {
          username,
          content: messageContent,
        });
        toast({ title: "Message sent successfully!" });
      } catch (error: any) {
        toast({ title: "Error sending message", description: error.message });
      }
  };

  const fetchAIMessages = async () => {
    try {
      const response = await axios.post("/api/suggeste-messages");
      const result = response.data;
      console.log(result);

      const resultArray = result.result.split("||");
      setSuggestedMessages(resultArray);
    } catch (error) {
      const axiosErro = error as AxiosError<ApiResponse>;
      toast({
        title: "Error fetching messages",
        description: axiosErro.response?.data.message,
      });
    }
  };

  const handleInputSugguested = (index: number) => {
    setSuggestedInput(suggestedMessages[index]);
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
            value={messageContent ? messageContent : suggestedInput}
            onChange={(e) => setMessageContent(e.target.value)}
          />
        </div>
        <div className="w-1/2 mx-auto mt-6">
          {userAcceptMessage ? (
            <Button
              onClick={sendMessageApi}
              className="bg-purple-600 font-bold text-black px-4 py-2 hover:bg-purple-500 transition-all hover:scale-110 duration-500 uppercase"
            >
              Send It
            </Button>
          ) : (
            <Button
              onClick={handleUserAcceptMessage}
              className="bg-purple-600 font-bold text-black px-4 py-2 hover:bg-purple-500 transition-all hover:scale-110 duration-500 uppercase"
            >
              Message Not Send
            </Button>
          )}
        </div>
        <div className="w-1/2 mx-auto mt-9">
          <h1 className="text-4xl text-center tracking-tighter font-semibold uppercase">
            AI Suggested Messages
          </h1>
        </div>
        <div className="flex items-center justify-center mt-6 ">
          <Button
            onClick={fetchAIMessages}
            className="bg-purple-600 font-bold text-black px-4 py-2 hover:bg-purple-500 transition-all hover:scale-105 duration-500 uppercase"
          >
            Suggested Messages
          </Button>
        </div>
        <div className=" h-72 w-1/2 mx-auto mt-2 bg-gray-100 flex  justify-center flex-col gap-2 ">
          {suggestedMessages.map((message, index) => (
            <p
              key={index}
              className="text-center text-lg font-medium px-3 py-2 border-[1px] border-black rounded-lg hover:scale-105 duration-300 transition-all hover:bg-purple-300 cursor-pointer "
              onClick={() => handleInputSugguested(index)}
            >
              {message}
            </p>
          ))}
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
