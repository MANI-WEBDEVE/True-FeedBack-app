import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOption);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$message' },
      { $sort: { 'message.createdAt': -1 } },
      { $group: { _id: '$_id', message: { $push: '$message' } } },
    ]).exec();

    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "User Not found " },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, message: user[0].message },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Something Went Wrong User UnAUthorized" },
      { status: 500 }
    );
  }
}


