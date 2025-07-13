import { Router } from "express";
import { verifyJwt } from "../middlewares/verfyJwt.js";
import {
  reviews,
  getReviews,
  getProduct,
  getProductByCategory,
  getAllProducts,
  getProductByQuery,
} from "../controllers/productController.js";
const productRouter = Router();

productRouter.route("/reviews/:productId").post(verifyJwt, reviews);
productRouter.route("/get-reviews/:id").get( getReviews);
productRouter.route("/get-product/:productId").get( getProduct);
productRouter.route("/get-product-by-category").get(getProductByCategory);
productRouter.route("/get-all-products").get( getAllProducts);
productRouter.route("/get-product-by-query").get( getProductByQuery);

export default productRouter;
