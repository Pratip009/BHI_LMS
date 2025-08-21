import notificationModel from "../models/notficationModel";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import { NextFunction, Response, Request } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron";
//get all notification --- only admin
export const getNotifications = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await notificationModel
        .find()
        .sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        notification,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//update notification status --- admin only

export const updateNotification = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await notificationModel.findById(req.params.id);
      if (!notification) {
        return next(new ErrorHandler("Notification not found", 404));
      } else {
        notification.status
          ? (notification.status = "read")
          : notification.status;
      }
      await notification.save();
      const notifications = await notificationModel
        .find()
        .sort({ createdAt: -1 });
      res.status(201).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//delete notifications --- admin only

cron.schedule("0 0 0 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await notificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDaysAgo },
  });
  console.log("Deleted read notifications");
});
