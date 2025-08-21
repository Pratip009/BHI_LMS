import express from "express";
import { AuthorizedRoles, isAuthenticated } from "../middleware/auth";
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from "../controllers/analytics.controller";
import { updateAccessToken } from "../controllers/user.controller";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-users-analytics",
  updateAccessToken,
  isAuthenticated,
  AuthorizedRoles("admin"),
  getUserAnalytics
);
analyticsRouter.get(
    "/get-courses-analytics",
    updateAccessToken,
    isAuthenticated,
    AuthorizedRoles("admin"),
    getCourseAnalytics
  );
  
  analyticsRouter.get(
    "/get-orders-analytics",
    updateAccessToken,
    isAuthenticated,
    AuthorizedRoles("admin"),
    getOrderAnalytics
  );
export default analyticsRouter;
