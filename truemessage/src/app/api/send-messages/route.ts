import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { Message } from "@/models/User.model";

export async function POST(request: Request) {
  await dbConnect();
  const { content, username } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 } 
      );
    }
    if (!user.isAcceptingMessage) {     
      return Response.json(
        { success: false, message: "User is not accepting messages" },
        { status: 400 }
      );
    }
    const newMessage = {
      content,
      createdAt: new Date(),
    };
    user.message.push(newMessage as Message);
    const updatedUser = await user.save();

    return Response.json(
      { success: true, message: "Message sent successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.log("internal Server Error: ",error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
