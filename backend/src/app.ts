
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true
}));
app.use(cookieParser());

// routers
import { userRouter } from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import messageRouter from "./routes/messagesRoutes.js";

app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/message", messageRouter);

export default app;