import { Router } from "express";
import { sendMessageByUser, getMessages, sendMessageByAdmin } from "../controllers/messageController.js";
import { verifyJwt } from "../middlewares/verfyJwt.js";
import { verifyJwt as verifyAdminJwt } from "../middlewares/admin/verifyJwt.js";

const messageRouter = Router();

messageRouter.route("/send-message-by-user").post(
    verifyJwt,
    sendMessageByUser
);

messageRouter.route("/get-messages").get(
    verifyJwt || verifyAdminJwt,
    getMessages
);

messageRouter.route("/send-message-by-admin/:userId").post(
    verifyAdminJwt,
    sendMessageByAdmin
);

export default messageRouter;