import express from "express";
import {signUp, signIn, changePassword,changeAvatar,updateEmail, EmailVerification, logout,verifyOtp, deleteAccount, getUser, resendOtp, getAvatar, updatePreferences, updatePersonalInfo } from "../controllers/userController.js";
import { verifyJwt } from "../middlewares/verfyJwt.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.route("/sign-up").post(signUp);
router.route("/sign-in").post(signIn);
router.route("/update-password").patch(
    verifyJwt,
    changePassword
);
router.route("/update-avatar").patch( 
    verifyJwt,
    upload.single("avatar"),
    changeAvatar
);
router.route("/update-email").patch(
    verifyJwt,
    updateEmail
);
router.route("/email-verification").post(
    verifyJwt, 
    EmailVerification
);
router.route("/logout").post(
    verifyJwt,
    logout
);
router.route("/verify-otp/:userId").post(
    verifyOtp
);
router.route("/delete-account").delete(
    verifyJwt,
    deleteAccount
);  
router.route("/get-user").get(
    verifyJwt,
    getUser
);  
router.route("/resend-otp/:userId").post(resendOtp);
router.route("/get-avatar").get(getAvatar);
router.route("/update-preferences").patch(
    verifyJwt,
    updatePreferences
);
router.route("/update-personal-info").patch(
    verifyJwt,
    updatePersonalInfo
);
export const userRouter = router;
