import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
// import { User } from "next-auth";


interface User {
  _id?: string;
  isVerify?: boolean;
  isAcceptingMessage?: boolean;
  username?: string;
  success?: boolean;
  message?: string;
  status?: number;
}


export async function POST(request: Request):Promise<User> {
  await dbConnect();
  const session = await getServerSession(authOption);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptingMessages } = await request.json();
  console.log(acceptingMessages);
  
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      isAcceptingMessage: acceptingMessages,
    }, {new: true});
    if (!updatedUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );

  } catch (error) {
    console.log("Failed To Updated User");
    return Response.json(
      { success: false, message: "Failed To Updated User" },
      { status: 500 }
    );
  }
}

export async function GET(request:Request):Promise<User> {
  await dbConnect();
  const session = await getServerSession(authOption);
  const user: User = session?.user as User;
  console.log(user)
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  
  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId); ;
    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    } 

    return Response.json(
     
      { success: true, message: "user enbale accpting messages option", isAcceptingMessage: foundUser.isAcceptingMessage  },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "User unAuthorized" },
      { status: 500 }
    );
  }
}