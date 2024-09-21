'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import autoplay from "embla-carousel-autoplay"
import messages from "@/messages.json"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import fade from "embla-carousel-fade"
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

function page() {
  
  return (
    <>
    <main className="w-full h-[100vh] bg-gray-100 flex  ">
      <section className="w-[40%] mt-[150px] ml-[100px]">
     
        <h1 className="text-4xl font-semibold tracking-tighter"><span className="text-purple-600"> True</span> Messages From People <span className="text-purple-600"> Like You</span></h1>
        <p className="text-lg font-light mt-4 ">
          True Messages is a place where people can share their thoughts and
          feelings without fear of judgment or rejection. It is a platform where
          you can express yourself freely, without revealing your real name or
          any personal information. You can write about anything you want, from
          your daily life to your deepest fears and desires. The messages are
          completely anonymous, and will be sent to a random user.
        </p>
      </section>
      <section className="w-[50%] ml-[200px] mt-24 max-w-md ">
      <Carousel className=" max-w-sm shadow-xl shadow-purple-100" plugins={[autoplay({delay:2000}), fade({active:true})]}>
      <CarouselContent>
      {
        messages.map((message, index) => (
          <CarouselItem key={index}>
          <div className="p-1">
            <Card>
              <CardHeader className="text-4xl uppercase font-normal text-purple-700 mt-2">
                {message.title}
              </CardHeader>
              <CardContent className="flex aspect-video items-center justify-center ">
                <span className="text-sm font-medium ">{message.description}</span>
              </CardContent>
              <CardFooter className="text-sm relative bottom-0 font-light text-purple-700">
                {
                  message.author
                }
              </CardFooter>
            </Card>
          </div>
        </CarouselItem>
        ))
      }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
      </section>
    </main>
    </>
  )
}

export default page
