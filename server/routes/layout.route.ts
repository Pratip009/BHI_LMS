import express from "express";
import { AuthorizedRoles, isAuthenticated } from "../middleware/auth";
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../controllers/layout.controller";
import { updateAccessToken } from "../controllers/user.controller";

const layoutRouter = express.Router();

layoutRouter.post(
  "/create-layout",
  updateAccessToken,
  isAuthenticated,
  AuthorizedRoles("admin"),
  createLayout
);
layoutRouter.put(
  "/edit-layout",
  updateAccessToken,
  isAuthenticated,
  AuthorizedRoles("admin"),
  editLayout
);
layoutRouter.get(
  "/get-layout/:type",
  getLayoutByType
);

export default layoutRouter;
