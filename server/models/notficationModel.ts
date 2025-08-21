import mongoose, { Document, Schema, Model } from "mongoose";

export interface INotification extends Document {
  title: string;
  userId: string;
  message: string;
  status: string;
}
const notificationSchema = new Schema<INotification>({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "unread",
  },
});

const notificationModel: Model<INotification> = mongoose.model(
  "Notification",
  notificationSchema
);
export default notificationModel;
