import { signupSchema } from "../zodSchemas/signupSchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import User, { UserI } from "../models/userModel.js";
import { emailVerification } from "../services/resend.js";
import { signInSchema } from "../zodSchemas/signInSchema.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { newRequest } from "../middlewares/verfyJwt.js";
import { otpSchema } from "../zodSchemas/otp.js";
import { uploadFile } from "../utils/cloudinary.js";
import { unlink } from "node:fs/promises";
import mongoose, { isValidObjectId } from "mongoose";
import { emailQueue } from "../queues/emal.queue.js";
import redis from "../services/redis.js";
import { preferencesSchema } from "../zodSchemas/preferencesSchema.js";
import { updateUserInfoSchema } from "../zodSchemas/updateUserInfoSchema.js";

export const generateToken = async(userId: mongoose.Schema.Types.ObjectId): Promise<string> => {
  try {
    if(!isValidObjectId(userId)) {
      throw new Error("Invalid user id.");
    }
    const user = await userModel.findById(userId);
    if(!user) {
      throw new Error("User not found.");
    }
    const token = jwt.sign(
      { _id: user._id, email: user.email, fullName: user.fullName, isVerified: user.isVerified },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    return token as string;
  } catch (error: unknown) {
    if(error instanceof Error) {
      return error.message;
    }
    return "Something went wrong during access token generation.";
  }

}


export const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      const error = result.error.issues[0].message;
      return res
        .status(400)
        .json(
          new ApiResponse(false, 400, error || "All credentials are required")
        );
    }

    const { fullName, email, password, confirmPassword } = result.data;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json(new ApiResponse(false, 400, "Passwords do not match"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json(new ApiResponse(false, 400, "User already exists this account please login"));
    }

    const user = await User.create({ fullName, email, password });
    if (!user) {
      return res
        .status(201)
        .json(new ApiResponse(false, 400, "Sign-up Failed."));
    }

    const otp = Math.floor(Math.random() * 1000000);
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    user.otp = otp.toString();
    user.otpExpiry = otpExpiry;
    await user.save();

    await emailQueue.add(
      "verify-email",
      {
        type: "verify-email",
        payload: {
          userName: user.fullName,
          email: user.email,
          otp: user.otp,
        },
      },
      {
        attempts: 3,
        backoff: 5000, // retry after 5 sec
      }
    );

    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      isVerified: user.isVerified,
      avatar: user.avatar,
    }
    return res
      .status(201)
      .json(new ApiResponse(true, 201, "Sign-up successfully. Please verify your email.", { user: userData }));
  }
);

export const signIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: { email: string; password: string } = req.body;
    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      res
        .status(400)
        .json(
          new ApiResponse(
            false,
            400,
            result.error.issues[0].message || "All credentials are required"
          )
        );
    }
    const unverifiedUser = await userModel.findOne({
      email,
      isVerified: false,
    });
   
    if (unverifiedUser) {
      const validatePassword = await bcrypt.compare(password, unverifiedUser.password);
      if (!validatePassword) {
        return res
          .status(400)
          .json(new ApiResponse(false, 400, "Invalid password. Please try again."));
      }
      const otp = Math.floor(Math.random() * 1000000);
      const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
      unverifiedUser.otp = otp.toString();
      unverifiedUser.otpExpiry = otpExpiry;
      await unverifiedUser.save();

     await emailQueue.add(
      "verify-email",
      {
        type: "verify-email",
        payload: {
          userName: unverifiedUser.fullName,
          email: unverifiedUser.email,
          otp: unverifiedUser.otp,
        },
      },
      {
        attempts: 3,
        backoff: 5000, // retry after 5 sec
      }
    );

     return  res.status(200)
        .json(
          new ApiResponse(
            true,
            200,
            "Verification code sent successfully to your email. Please verify your email",
            { user: unverifiedUser  }
          )
        );
     
    }

    const verifiedUser = await userModel.findOne({ email, isVerified: true });
    if (!verifiedUser) {
      return res
        .status(400)
        .json(new ApiResponse(false, 400, "User not found"));
    }

    if(verifiedUser.isAccountSuspended) {
      return res
        .status(400)
        .json(new ApiResponse(false, 400, "Your account has been suspended. Please contact Mega-Mall support team."));
    }

    const isValidPassword = await bcrypt.compare(
      password,
      verifiedUser.password
    );
    if (!isValidPassword) {
      return res
        .status(400)
        .json(new ApiResponse(false, 400, "Invalid password. Please try again."));
    }
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(
      {
        _id: verifiedUser._id,
        email: verifiedUser.email,
        fullName: verifiedUser.fullName,
        isVerified: verifiedUser.isVerified,
      },
      JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("Token", token, options)
      .json(new ApiResponse(true, 200, "Sign-in successfully.",{ user: verifiedUser, token }));
  }
);

export const changePassword = asyncHandler(
  async (req: newRequest , res: Response, next: NextFunction) => {
    const { currentPassword, newPassword }: { currentPassword: string; newPassword: string } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json(new ApiResponse(false, 400, "All credentials are required"));
    }

    if(currentPassword === newPassword) {
      return res.status(400).json(new ApiResponse(false, 400, "New password cannot be same as current password"));
    }
    const userId = req.user?._id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiResponse(false, 404, "User not found"));
    }

    const isMatch = await bcrypt.compare(currentPassword.trim(), user.password);
    if (!isMatch) {
      return res.status(400).json(new ApiResponse(false, 400, "Current password is incorrect"));
    }
    user.password = newPassword.trim();
    await user.save();

    return res.status(200).json(new ApiResponse(true, 200, "Password updated successfully."));
  }
);

export const EmailVerification = asyncHandler(
  async (req: newRequest, res: Response) => {
    const { newEmail } = req.body;
    const emailSchema = signInSchema.pick({ email: true });
    const result = emailSchema.safeParse({ email: newEmail });
    if (!result.success) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            false,
            400,
            result.error.issues[0].message || "Email address required."
          )
        );
    }
    const userId = req.user?._id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "User not found"));
    }

    const existingUser = await userModel.findOne({ email: newEmail });
    if (existingUser) {
      return res
        .status(400)
        .json(new ApiResponse(false, 400, "Email already in use"));
    }
    const otp = Math.floor(Math.random() * 1000000);
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    user.otp = otp.toString();
    user.otpExpiry = otpExpiry;
    await user.save();
     await emailQueue.add(
      "verify-email",
      {
        type: "verify-email",
        payload: {
          userName: user.fullName,
          email: newEmail,
          otp: user.otp,
        },
      },
      {
        attempts: 3,
        backoff: 5000, // retry after 5 sec
      }
    );
   return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          200,
          "Verification code sent successfully to your new email. Please verify your email."
        )
      );
   
  }
);


export const updateEmail = asyncHandler(async(req: newRequest, res: Response ) => {
  const {newEmail} = req.body;
  console.log(newEmail)
  if(!newEmail) {
    return res.status(400).json(new ApiResponse(false, 400, "Please enter new email."));
  }
  const emailSchema = signInSchema.pick({ email: true });
  const result = emailSchema.safeParse({ email: newEmail });
  if (!result.success) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          false,
          400,
          result.error.issues[0].message || "Email address required."
        )
      );
  }
   
  const existsEmail = await userModel.findOne({email: newEmail})
  if(existsEmail) {
    return res.status(400).json(new ApiResponse(false, 400, "This email address is currently in use."));
  }

  
  const userId = req.user?._id;

  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json(new ApiResponse(false, 404, "User not found."));
  }

  user.email = newEmail;
  await user.save();
  return res.status(200).json(new ApiResponse(true, 200, "Email changed successfully."));

})

export const verifyOtp = asyncHandler(async (req: newRequest, res: Response) => {
  const { otp }: { otp: string } = req.body;
  const userId = req.params.userId;
 if(!isValidObjectId(userId)) {
  return res.status(400).json(new ApiResponse(false, 400, "Invalid user id"));
 }
  const result = otpSchema.safeParse(otp);
  if (!result.success) {
    return res.status(400).json(new ApiResponse(false, 400, result.error.issues[0].message || "Please enter valid verification code."));
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json(new ApiResponse(false, 404, "User not found"));
  }

  if (user.otp !== otp) {
    return res.status(400).json(new ApiResponse(false, 400, "Invalid verification code"));
  }

  if (user.otpExpiry < new Date()) {
    return res.status(400).json(new ApiResponse(false, 400, "Verification code has expired"));
  }

  user.isVerified = true;
  await user.save();
  return res.status(200).json(new ApiResponse(true, 200, "Verification successfully completed."));

})


export const resendOtp = asyncHandler(async (req: newRequest, res: Response) => {
  const userId = req.params.userId;
  const email = req.body.email;
  const emailSchema = signInSchema.pick({ email: true });
  const result = emailSchema.safeParse({ email });
  if (!result.success) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          false,
          400,
          result.error.issues[0].message || "email address is required"
        )
      );
  }

  if (!isValidObjectId(userId)) {
    return res.status(400).json(new ApiResponse(false, 400, "Invalid user id"));
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json(new ApiResponse(false, 404, "User not found"));
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // Set expiry time to 10 minutes from now

  user.otp = newOtp;
  user.otpExpiry = otpExpiry;
  await user.save();
  await emailQueue.add(
      "verify-email",
      {
        type: "verify-email",
        payload: {
          userName: user.fullName,
          email: email,
          otp: user.otp,
        },
      },
      {
        attempts: 3,
        backoff: 5000, // retry after 5 sec
      }
    );
  const { success, status, message } = await emailVerification(user.fullName, user.email, newOtp);
  if (!success) {
    return res.status(status).json(new ApiResponse(false, status, message));
  }

  return res.status(200).json(new ApiResponse(true, 200, "OTP resent successfully"));
});

export const changeAvatar = asyncHandler(
  async (req: newRequest, res: Response) => {
    const avatar = req.file?.path;
    if (!avatar) {
      return res
        .status(400)
        .json(new ApiResponse(false, 400, "Please upload an image"));
    }
    const userId = req.user?._id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, "User not found"));
    }

    const fileUpload = await uploadFile(avatar, "image");

    if (!fileUpload) {
      return res
        .status(400)
        .json(new ApiResponse(false, 400, "Something went wrong during file upload."));
    }
    user.avatar = fileUpload.url;
    await user.save();
    await unlink(avatar);

    return res
      .status(200)
      .json(new ApiResponse(true, 200, "Avatar changed successfully.",{ avatar: fileUpload.url }));
  }
);

export const logout = asyncHandler(async(req: newRequest, res: Response) => {
  const options = {
    httpOnly: true,
    secure: true
  }
  await redis.del(`user:${req.user?._id}`);
 return res.status(200)
 .clearCookie("Token", options)
 .json(new ApiResponse(true, 200, "Logout successfully."));

});

export const deleteAccount = asyncHandler(async(req: newRequest, res: Response) => {
  const userId = req.user?._id; 
  const {password} = req.body;
  if(!password) {
    return res.status(400).json(new ApiResponse(false, 400, "Please enter your password."));
  }
  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json(new ApiResponse(false, 404, "User not found."));
  }

  const isMatch = await bcrypt.compare(password.trim(), user.password);
  if (!isMatch) {
    return res.status(400).json(new ApiResponse(false, 400, "Invalid password."));
  }

  await userModel.findByIdAndDelete(userId);
  await redis.del(`user:${userId}`)
  return res.status(200)
  .json(new ApiResponse(true, 200, "Account deleted successfully.")); 

})

export const getUser = asyncHandler(async(req: newRequest, res: Response) => {

  const userId = req.user?._id;
  if(!isValidObjectId(userId)) {
    return res.status(400).json(new ApiResponse(false, 400, "Invalid user id."));
  }
  const cache = await redis.get(`user:${userId}`);
  if(cache) {
    return res.status(200).json(new ApiResponse(true, 200, "User found successfully.", JSON.parse(cache)));
  }
  const user = await userModel.aggregate([
    {$match: {
      _id: userId
    }},
    {$project: {
      password: 0,
      otp:0,
      otpExpiry:0
    }}
  ])
  if (!user || user.length === 0) {
    return res.status(404).json(new ApiResponse(false, 404, "User not found."));
  }
  await redis.set(`user:${userId}`, JSON.stringify(user), "EX", 30); // 30 seconds expiry
  return res.status(200).json(new ApiResponse(true, 200, "User found successfully.", user[0]));

})  

export const getAvatar = asyncHandler(async(req: newRequest, res: Response) => {
  const userId = req.user?._id;
  if(!isValidObjectId(userId)) {
    return res.status(400).json(new ApiResponse(false, 400, "Invalid user id."));
  }
  const cache = await redis.get(`user:${userId}`);
  if(cache) {
    return res.status(200).json(new ApiResponse(true, 200, "Avatar found successfully.", JSON.parse(cache)));
  }
  const user = await userModel.findById(userId);
  if(!user) {
    return res.status(404).json(new ApiResponse(false, 404, "User not found."));
  }
  await redis.set(`user:${userId}`, JSON.stringify(user), "EX", 60 * 60 * 24); // 24 hours expiry
  return res.status(200).json(new ApiResponse(true, 200, "Avatar found successfully.", user.avatar));
});

export const updatePreferences = asyncHandler(async(req: newRequest, res: Response) => {
  const userId = req.user?._id;
  const { preferences } = req.body;

  if(!preferences ) {
    return res.status(400).json(new ApiResponse(false, 400, "Please provide valid preferences array."));
  }
  const validatePreferences = preferencesSchema.safeParse(preferences);
  if(!validatePreferences.success) {
    return res.status(400).json(new ApiResponse(false, 400, validatePreferences.error.issues[0].message) || "Preferences are required.");
  }

  if(!isValidObjectId(userId)) {
    return res.status(400).json(new ApiResponse(false, 400, "Invalid user id."));
  }

  const updatedUser = await userModel.findByIdAndUpdate(userId,preferences, {new: true})
  if(!updatedUser) {
        return res.status(500).json(new ApiResponse(false, 500, "Failed to update preferences."));

  }

  // const user = await userModel.findById(userId);
  // if(!user) {
  //   return res.status(404).json(new ApiResponse(false, 404, "User not found."));
  // }

  // user.preferences = preferences;
  // await user.save();

  // Invalidate user cache since preferences changed
  await redis.del(`user:${userId}`);

  return res.status(200).json(
    new ApiResponse(
      true, 
      200, 
      "Preferences updated successfully.",
      { preferences: updatedUser.preferences   } 
    )
  );
});

export const updatePersonalInfo = asyncHandler(async(req: newRequest, res: Response) => {
  const userId = req.user?._id;
  const { fullName, gender, dateOfBirth, phoneNumber, address } = req.body;

  if(!isValidObjectId(userId)) {
    return res.status(400).json(new ApiResponse(false, 400, "Invalid user id."));
  }
  const validateData = updateUserInfoSchema.safeParse({
    fullName,
    gender,
    dateOfBirth,
    phoneNumber,
    address
  });
  if(!validateData.success) {
    return res.status(400).json(new ApiResponse(false, 400, validateData.error.issues[0].message || "All fields are required."));
  }

  
  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        ...(fullName && { fullName }),
        ...(gender && { gender }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(phoneNumber && { phoneNumber }),
        ...(address && { address })
      }
    },
    { new: true, runValidators: true }
  ).select('-password -otp -otpExpiry');

  if(!updatedUser) {
    return res.status(400).json(new ApiResponse(false, 400, "Failed to update personal information."));
  }

  // Invalidate user cache
  await redis.del(`user:${userId}`);

  return res.status(200).json(
    new ApiResponse(
      true,
      200,
      "Personal information updated successfully.",
      { user: updatedUser }
    )
  );
});



