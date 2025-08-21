// services/order.service.ts
import { Request, Response, NextFunction } from 'express';
import { CatchAsyncErrors } from '../middleware/catchAsyncErrors';
import orderModel, { IOrder } from '../models/orderModel';
import ErrorHandler from '../utils/ErrorHandler';
import userModel from '../models/user.model';
import CourseModel from '../models/course.model';

export const newOrder = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, courseId, payment_info } = req.body as IOrder;

    // Validate required fields
    if (!userId || !courseId) {
      console.error('❌ Missing required fields:', { userId, courseId });
      return next(new ErrorHandler('User ID and Course ID are required', 400));
    }

    console.log('📥 Received order data:', { userId, courseId, payment_info });

    try {
      // Verify user and course existence
      const user = await userModel.findById(userId);
      if (!user) {
        console.error('❌ User not found:', userId);
        return next(new ErrorHandler('User not found', 404));
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        console.error('❌ Course not found:', courseId);
        return next(new ErrorHandler('Course not found', 404));
      }

      // Check for duplicate purchase
      const courseExistInUser = user.courses.some(
        (courseObj: any) => courseObj.courseId.toString() === courseId
      );
      if (courseExistInUser) {
        console.warn('❌ User already purchased course:', courseId);
        return next(new ErrorHandler('You have already purchased this course', 400));
      }

      // Create order
      const order = await orderModel.create({
        userId,
        courseId,
        payment_info: payment_info || {},
      });

      console.log('✅ Order created successfully:', order);

      // Update user courses
      user.courses.push({ courseId });
      await user.save();
      console.log('✅ User courses updated:', userId);

      // Update course purchased count
      course.purchased = (course.purchased || 0) + 1;
      await course.save();
      console.log('✅ Course purchased count updated:', courseId);

      res.status(201).json({
        success: true,
        order,
      });
    } catch (error: any) {
      console.error('❌ Error creating order:', error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAllOrderService = async (res: Response) => {
  try {
    const orders = await orderModel.find().sort({ createdAt: -1 });

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const user = await userModel.findById(order.userId).select('name email');
        const course = await CourseModel.findById(order.courseId).select('name price');
        return {
          ...order.toObject(),
          user: user ? { _id: user._id, name: user.name, email: user.email } : null,
          course: course ? { _id: course._id, name: course.name, price: course.price } : null,
        };
      })
    );

    console.log('✅ Fetched orders with details:', enrichedOrders);

    res.status(200).json({
      success: true,
      orders: enrichedOrders,
    });
  } catch (error: any) {
    console.error('❌ Error fetching orders:', error.message);
    throw new ErrorHandler(error.message, 400);
  }
};