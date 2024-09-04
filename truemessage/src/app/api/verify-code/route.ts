import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

interface VerifyCodeUser {
  success?: boolean;
  message?: string;
  status?: number;
  username?: string;
}


export async function POST(request: Request): Promise<VerifyCodeUser> {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const decodedUserName = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUserName });

    if (!user) {
      return Response.json(
        { success: false, message: "User is Not Found" },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeExpiry = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeExpiry) {
      user.isVerify = true;
      await user.save();
    } else if (!isCodeExpiry) {
      return Response.json(
        { success: false, message: "your code is expire please sign in again" },
        { status: 402 }
      );
    } else {
      return Response.json(
        { success: false, message: "Invalid Verification Code" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "User Successfully Verify" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Verify code is User Invalid");
    return Response.json(
      { success: false, message: "Error Verification Code" },
      { status: 500 }
    );
  }
}
