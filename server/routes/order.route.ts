import Express from "express";
import { AuthorizedRoles, isAuthenticated } from "../middleware/auth";
import {
  createOrder,
  getAllOrders,
  newPayment,
  sendStripePublishableKey,
} from "../controllers/order.controller";
import { updateAccessToken } from "../controllers/user.controller";
const orderRouter = Express.Router();

orderRouter.post(
  "/create-order",
  updateAccessToken,
  isAuthenticated,
  createOrder
);

orderRouter.get(
  "/get-all-orders",
  updateAccessToken,
  isAuthenticated,
  AuthorizedRoles("admin"),
  getAllOrders
);
orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);

orderRouter.post("/payment", isAuthenticated, newPayment);

export default orderRouter;
