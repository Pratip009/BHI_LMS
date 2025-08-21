import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import orderModel, { IOrder } from "../models/orderModel";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import sendMail from "../utils/sendMail";
import notificationModel from "../models/notficationModel";
import { getAllOrderService, newOrder } from "../services/order.service";
import { redis } from "../utils/redis";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create order
// controllers/order.controller.ts
export const createOrder = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, payment_info, userId } = req.body;

    try {
      console.log('📥 Received createOrder request:', { courseId, userId, payment_info });

      // Validate payment if provided
      if (payment_info && 'id' in payment_info) {
        const paymentIntentId = payment_info.id;
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (!paymentIntent) {
          console.error('❌ PaymentIntent not found:', paymentIntentId);
          return next(new ErrorHandler('Payment not found', 404));
        }

        if (paymentIntent.status !== 'succeeded') {
          console.error('❌ Payment not succeeded:', paymentIntent.status);
          return next(new ErrorHandler('Payment not authorized', 400));
        }
      }

      // Call newOrder service
      await newOrder(req, res, next);

      // Send confirmation email
      const user = await userModel.findById(userId);
      const course = await CourseModel.findById(courseId);
      if (user && course) {
        const mailData = {
          name: user.name,
          order: {
            _id: course._id.toString(),
            name: course.name,
            price: course.price,
            date: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          },
        };

        await sendMail({
          email: user.email,
          subject: 'Order Confirmation',
          template: 'order-confirmation.ejs',
          data: mailData,
        });
        console.log('✅ Order confirmation email sent to:', user.email);

        // Create notification
        await notificationModel.create({
          title: 'New Course Order',
          user: user._id,
          message: `You have a new order for the ${course.name} course`,
        });
        console.log('✅ Notification created for order');
      }
    } catch (error: any) {
      console.error('❌ Error in createOrder:', error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get all orders --- admin only

export const getAllOrders = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrderService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//send stripe publishable key
export const sendStripePublishableKey = CatchAsyncErrors(
  async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

export const newPayment = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Log received amount for debugging
      console.log("Received Payment Intent Amount:", req.body.amount);

      // Ensure amount is passed as an integer
      const amount = parseInt(req.body.amount, 10); // Parse to integer

      // Log the amount after parsing
      console.log("Parsed Amount:", amount);

      // Verify amount is valid
      if (isNaN(amount)) {
        console.error("Invalid amount:", req.body.amount);
        return next(new ErrorHandler("Invalid amount", 400));
      }

      const myPayment = await stripe.paymentIntents.create({
        amount: amount, // Ensure this is passed as an integer
        currency: "USD",
        metadata: {
          company: "ELearning",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log("Payment Intent Created:", myPayment); // Log the created payment intent

      res.status(201).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      console.error("Payment Intent Creation Error:", error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
