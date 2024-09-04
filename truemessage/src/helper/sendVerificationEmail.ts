import { resend } from "@/lib/resendEmail";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/verificationEmail";

export async function sendVerificationEmail(email:string, username:string, verifyCode:string):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Inam-Corporation.dev',
            to: email,
            subject: 'Verify Email',
            react: VerificationEmail({username, otp:verifyCode}),
          });
                  

        return {success:true, message: "Email send is succesfully"}      
    } catch (emailError) {
        console.log(`Email Verification is failed: ${emailError}`);
        return {success:false, message: "Email not send for user"}        
    }
}