import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User.model";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest ) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    const existingUserVerifiedByUserName = await UserModel.findOne({
      username,
      isVerify: true,
    });

    if (existingUserVerifiedByUserName) {
      return NextResponse.json(
        { succes: false, message: "UserNama is already taken" },
        { status: 400 }
      );
    }

    const existingUserVerifyByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserVerifyByEmail) {
      if (existingUserVerifyByEmail.isVerify) {
        return NextResponse.json({succes: false, message: "User is exist with this email"}, {status: 400})
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        existingUserVerifyByEmail.password = hashPassword;
        existingUserVerifyByEmail.verifyCode = verifyCode;
        existingUserVerifyByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserVerifyByEmail.save()
      }
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerify: false,
        isAcceptingMessage: true,
        message: [],
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
        return NextResponse.json({ succes: false, message: emailResponse.message }, {status: 500})
    }
    return NextResponse.json({ succes: true, message:"user Succesfully sign-up" }, {status: 200})
    

  } catch (error) {
    const message = error as string;
    console.log(`SomeThing Went Wrong User Signup Error ${message}`);
    return NextResponse.json(
      { success: false, message: "User Signup Error" },
      { status: 500 }
    );
  }
}
