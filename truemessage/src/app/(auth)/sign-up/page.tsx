"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { SignUpSchema } from "@/Schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { LuEye, LuEyeOff } from "react-icons/lu";

const Signup = () => {
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("");
  const [userNameMessage, setUserNameMessage] = useState<string>("");
  const [isCheckingUserName, setIsCheckingUserName] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false); // Track client mount state
  const router = useRouter();

  const debounced = useDebounceCallback((value: string) => setUserName(value), 500);

  // zod schema integration with react-hook-form
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    setIsMounted(true); // Now the component has mounted on the client
  }, []);

  useEffect(() => {
    if (isMounted) {
      const checkUniqueUserName = async () => {
        if (userName.trim()) {
          setIsCheckingUserName(true);
          setUserNameMessage("");
          try {
            const response = await axios.get(
              `/api/check-username-unique?username=${userName}`
            );
            setUserNameMessage(response.data.message);
          } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            setUserNameMessage(
              axiosError.response?.data.message || "Internal Server Error"
            );
          } finally {
            setIsCheckingUserName(false);
          }
        }
      };
      checkUniqueUserName();
    }
  }, [userName, isMounted]);

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "Sign up failed";
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordField = () => {
    setTogglePassword((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800/10 p-8">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl tracking-tighter font-extrabold mb-4">
            Join <span className="text-purple-600">TRUE-</span> Messages
          </h1>
          <p className="text-center tracking-tighter mb-4">
            Let's Sign Up and{" "}
            <span className="text-purple-600 font-medium">
              Join Anonymous Messages Adventure.
            </span>
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter Your Username"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {isMounted && ( // Ensure this runs only after client-side mount
                    <>
                      {isCheckingUserName ? (
                        <Loader2 className="animate-spin text-purple-600" />
                      ) : (
                        <p className={userNameMessage === "User Name is Unique" ? "text-green-500 text-sm" : "text-red-500 text-xs"}>
                          {userNameMessage || "Username not checked yet"}
                        </p>
                      )}
                    </>
                  )}
                  <FormDescription>
                    Please enter a unique username. Your username should be
                    between 4 to 16 characters long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter Your Email address"
                    {...field}
                  />
                  <FormDescription>
                    Please enter a valid email. We'll send a verification code
                    to your email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Input
                      type={togglePassword ? "text" : "password"}
                      placeholder="Enter Your Password"
                      {...field}
                    />
                    <div onClick={togglePasswordField} className="absolute top-3 right-3 cursor-pointer">
                      {togglePassword ? (
                        <LuEye />
                      ) : (
                        <LuEyeOff />
                      )}
                    </div>
                  </div>
                  <FormDescription>
                    Please enter a strong password. Your password should be at
                    least 8 characters long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`${isSubmitting ? "bg-purple-600" : "bg-black"}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" /> Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <Link href="/sign-in" className="text-blue-500 hover:text-blue-700">
            Already a member? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
