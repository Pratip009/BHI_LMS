import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCourseService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import notificationModel from "../models/notficationModel";
import axios from "axios";
//upload course
export const uploadCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//edit course

export const editCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      const courseId = req.params.id;
      const courseData = (await CourseModel.findById(courseId)) as any;

      if (thumbnail && !thumbnail.startsWith("http")) {
        await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      if (thumbnail.startsWith("http")) {
        data.thumbnail = {
          public_id: courseData?.thumbnail.public_id,
          url: courseData?.thumbnail.url,
        };
      }

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );
      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get single course -- without purchasing

export const getSingleCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const isCacheExist = await redis.get(courseId);
      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        await redis.set(courseId, JSON.stringify(course), "EX", 604800);
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get all courses
export const getAllCourses = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allCourses");

      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get course content -- only for valid users

export const getCourseByUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;
      console.log(
        "getCourseByUser - User ID:",
        req.user?._id,
        "Course ID:",
        courseId
      );

      // Check if user has purchased the course
      const courseExist = userCourseList?.find(
        (course: any) => course.courseId.toString() === courseId
      );
      if (!courseExist) {
        console.log("User has not purchased course:", req.user?._id, courseId);
        return next(
          new ErrorHandler("You are not eligible to access this course", 404)
        );
      }

      // Fetch course from database
      const course = await CourseModel.findById(courseId);
      if (!course) {
        console.log("Course not found:", courseId);
        return next(new ErrorHandler("Course not found", 404));
      }

      const content = course.courseData;
      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      console.error("getCourseByUser - Error:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add question in course

interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("Content not found", 404));
      }

      //create a new question
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };
      //add this question in our course content
      courseContent.questions.push(newQuestion);

      await notificationModel.create({
        user: req.user?._id,
        title: "New Question Recieved",
        message: `You have a new question in ${courseContent.title}`,
      });

      await course?.save();
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add answer in course

interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;
      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("Content not found", 404));
      }

      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );
      if (!question) {
        return next(new ErrorHandler("Invalid question ID", 400));
      }

      //create a new answer
      const newAnswer: any = {
        user: req.user,
        answer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (question.questionReplies ??= []).push(newAnswer);

      await course?.save();

      if (req.user?._id === question.user._id) {
        //create a notification
        await notificationModel.create({
          user: req.user?._id,
          title: "New Question Reply Recieved",
          message: `You have a new question in ${courseContent.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          tittle: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );
        try {
          await sendMail({
            email: question.user.email,
            subject: `New Answer on your question`,
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add review in course
interface IddReviewData {
  review: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;
      const courseExist = userCourseList?.some(
        (course: any) => course.courseId.toString() === courseId.toString()
      );

      if (!courseExist) {
        return next(
          new ErrorHandler("You are not eligible to add review", 404)
        );
      }
      const course = await CourseModel.findById(courseId);
      const { review, rating } = req.body as IddReviewData;
      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };
      course?.reviews.push(reviewData);

      let avg = 0;

      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });
      if (course) {
        course.ratings = avg / course.reviews.length;
      }
      await course?.save();
      await redis.set(courseId, JSON.stringify(course), "EX", 604800);

      //create a notification
      await notificationModel.create({
        user: req.user?._id,
        title: "New Review Recieved",
        message: `${req.user?.name} has added a review on ${course?.name}`,
      });

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//add reply to review (admin)

interface IAddReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReplyToReview = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewData;
      console.log("Request user:", req.user); // Debug user
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId
      );
      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }

      const replyData: any = {
        user: req.user,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }
      review.commentReplies?.push(replyData);

      await course?.save();

      try {
        await redis.set(courseId, JSON.stringify(course), "EX", 604800);
      } catch (redisError) {
        console.error("Redis caching error:", redisError);
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//get all courses --- admin only

export const getAllCoursesToAdmin = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCourseService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//delete course --- admin only

export const deleteCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const course = await CourseModel.findById(id);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      await course.deleteOne({ id });
      await redis.del(id);
      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//generate video url

export const generateVideoUrl = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        { ttl: 300 },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          },
        }
      );
      res.json(response.data);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
