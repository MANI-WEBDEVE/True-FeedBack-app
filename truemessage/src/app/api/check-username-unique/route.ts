import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { usernameValidation } from "@/Schemas/signUpSchema";
import { z } from "zod";

const UserNameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {

  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    //* validation For Zod;
    const result = UserNameQuerySchema.safeParse(queryParam);
    console.log({result});

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          succes: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(", ")
              : "invalid query parameter ",
        },
        { status: 400 }
      );
    }
    const { username } = result.data;
    const existingUserName = await UserModel.findOne({
      username,
      isVerify: true,
    });
    if (existingUserName) {
      return Response.json(
        { success: false, message: "username is already taken" },
        { status: 401 }
      );
    }
    return Response.json(
      { success: true, message: "User Name is Unique" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Please Check Username");
    return Response.json(
      { succes: false, message: "Error Checking Your UserName" },
      { status: 401 }
    );
  }
}
