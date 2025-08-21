import express from "express";
import { isAuthenticated, AuthorizedRoles } from "../middleware/auth";
import {
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller";
import { updateAccessToken } from "../controllers/user.controller";
const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notifications",
  updateAccessToken,
  isAuthenticated,
  AuthorizedRoles("admin"),
  getNotifications
);
notificationRouter.get(
  "/update-notification/:id",
  updateAccessToken,
  isAuthenticated,
  AuthorizedRoles("admin"),
  updateNotification
);

export default notificationRouter;
