import messageModel from "../models/messageModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { newRequest } from "../middlewares/verfyJwt.js";
import { Response } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import { messageSchema } from "../zodSchemas/messageSchema.js";
import userModel from "../models/userModel.js";
import { adminId } from "../utils/constant.js";
import { isValidObjectId } from "mongoose";
import { newAdminRequest } from "../middlewares/admin/verifyJwt.js";

const sendMessageByUser = asyncHandler(
  async (req: newRequest, res: Response) => {
    const { message } = req.body;
    const validateMessage = messageSchema.safeParse({message});
    if(!validateMessage.success) {
      return res
        .status(400)
        .json(new ApiResponse(false, 400, validateMessage.error.issues[0].message));
    }
    const userId = req.user?._id;
    const messageData = await messageModel.create({
      sender: userId,
      senderModel: "User",
      receiver: adminId,
      receiverModel: "Admin",
      message,
    });
    if(!messageData) {
      return res
        .status(500)
        .json(new ApiResponse(false, 500, "Message not sent."));
    }
    return res
      .status(200)
      .json(new ApiResponse(true, 200, "Message sent successfully."));
  }
);

const sendMessageByAdmin = asyncHandler(
    async (req: newAdminRequest , res: Response) => {
        const {userId} = req.params;
        if(!isValidObjectId(userId)) {
            return res
                .status(400)
                .json(new ApiResponse(false, 400, "Invalid user id."));
        }
        const { message } = req.body;
        const validateMessage = messageSchema.safeParse({message});
        if(!validateMessage.success) {
            return res
                .status(400)
                .json(new ApiResponse(false, 400, validateMessage.error.issues[0].message));
        }
        
        const user = await userModel.findById(userId);
        if(!user) {
            return res
                .status(404)
                .json(new ApiResponse(false, 404, "User not found."));
        }
        const messageData = await messageModel.create({
            sender: req.admin?._id,
            senderModel: "Admin",
            receiver: userId,
            receiverModel: "User",
            message,
        });
        if(!messageData) {
            return res
                .status(500)
                .json(new ApiResponse(false, 500, "Message not sent."));
        }
        return res
            .status(200)
            .json(new ApiResponse(true, 200, "Message sent successfully."));
    }
    );

    const getMessages = asyncHandler(
    async (req: newRequest , res: Response) => {
        const userId = req.user?._id;
        const messages = await messageModel.find({
        $or: [
        { sender: userId, senderModel: "User", receiver: adminId, receiverModel: "Admin" },
        { sender: adminId, senderModel: "Admin", receiver: userId, receiverModel: "User" },
        ],
        }).select("-__v -sender -receiver");
        if (!messages || messages.length === 0) {
        return res
            .status(400)
            .json(new ApiResponse(false, 400, "Messages not found."));
        }
        return res
            .status(200)
            .json(new ApiResponse(true, 200, "Messages fetched successfully.", messages));
    }
    );

export { sendMessageByUser, getMessages, sendMessageByAdmin };
