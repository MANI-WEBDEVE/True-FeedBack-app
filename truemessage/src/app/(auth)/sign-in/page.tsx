"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { SignInSchema } from "@/Schemas/signInSchema";
import { signIn } from "next-auth/react";

const SignIn = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log(result)
    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.push('/dashboard');
    }
  };


  const togglePasswordField = () => setTogglePassword((prev) => !prev);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800/10 p-8">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl tracking-tighter font-extrabold mb-4">
            Join <span className="text-purple-600">TRUE-</span> Messages
          </h1>
          <p className="tracking-tighter mb-4">
            Let's sign in and{" "}
            <span className="text-purple-600 font-medium">
              join the anonymous messages adventure.
            </span>
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your email or username"
                      {...field}
                    />
                  </FormControl>
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
                    <FormControl>
                      <Input
                        type={togglePassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <div
                      className="absolute top-3 right-3 cursor-pointer"
                      onClick={togglePasswordField}
                    >
                      {togglePassword ? <LuEye /> : <LuEyeOff />}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting ? "bg-purple-600" : "bg-black"
              } w-full`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
