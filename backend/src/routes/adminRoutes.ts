import { Router } from "express";
import {
  suggestProductDetails,
  uploadProduct,
  deleteProduct,
  signUp,
  login,
  updateProduct,
  deleteOrder,
  changeDeliveryStatus,
  logout,
  userOrders,
  toggleSuspension,
  dashboard,
  getAdmin,
  getUserOrdersById,
  getUserById,
  getAllAdmins,
  getAllUsers,
  deleteAdminById,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import { verifyJwt } from "../middlewares/admin/verifyJwt.js";

const adminRouter = Router();
adminRouter
  .route("/upload-product")
  .post(verifyJwt, upload.array("images"), uploadProduct);

adminRouter.route("/update-product/:id").patch(verifyJwt, updateProduct);

adminRouter.route("/suggest-product-details").post(verifyJwt, upload.single("image"), suggestProductDetails);

adminRouter.route("/delete-product/:id").delete(verifyJwt, deleteProduct);

adminRouter.route("/sign-up").post(signUp);

adminRouter.route("/login").post(login);

adminRouter.route("/delete-order").delete(verifyJwt, deleteOrder);

adminRouter.route("/change-delivery-status").patch(verifyJwt, changeDeliveryStatus);

adminRouter.route("/logout").post(verifyJwt, logout);

adminRouter.route("/orders").get(verifyJwt, userOrders); // get all orders of all users

adminRouter.route("/toggle-suspension/:userId").patch(verifyJwt, toggleSuspension); 

adminRouter.route("/dashboard").get(verifyJwt, dashboard);

adminRouter.route("/get-admin").get(verifyJwt, getAdmin);

adminRouter.route("/user-orders/:userId").get(verifyJwt, getUserOrdersById); // get all orders of a user

adminRouter.route("/user/:userId").get(verifyJwt, getUserById);

adminRouter.route("/users").get(verifyJwt, getAllUsers);

adminRouter.route("/admins").get(verifyJwt, getAllAdmins);

adminRouter.route("/delete-admin/:adminId").delete(verifyJwt, deleteAdminById); // delete admin by id

export default adminRouter;
