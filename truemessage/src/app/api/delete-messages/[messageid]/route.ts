import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";



export async function DELETE(request: Request , {params}: {params: {messageid: string}} ){
    const messageId = params.messageid;
    await dbConnect();
    const session = await getServerSession(authOption);
    const user: User = session?.user as User;
   
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        )
    }

    try {
      const updateMessageResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { message: { _id: messageId } } }
        )
        if (updateMessageResult.modifiedCount === 0) {
            return Response.json(
                { success: false, message: "Message not found" },
                { status: 404 }
            )
        }
        return Response.json(
            { success: true, message: "Message deleted successfully" },
            { status: 200 }
        )
        
    } catch (error) {
        return Response.json(
            { success: false, message: "Internal server error Message not deleted" },
            { status: 500 }
        )
    }

}