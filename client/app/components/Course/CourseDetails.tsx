import { styles } from '@/app/styles/style';
import CoursePlayer from '@/app/utils/CoursePlayer';
import Ratings from '@/app/utils/Ratings';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { IoIosCheckmarkCircleOutline, IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { format } from 'timeago.js';
import CourseContentList from '../Course/CourseContentList';
import { Elements } from '@stripe/react-stripe-js';
import CheckOutForm from '../Payment/CheckOutForm';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import Image from 'next/image';
import userImage from "../../../public/images/ussernew.png"

type Props = {
  data: any;
  stripePromise: any;
  clientSecret: string;
  setOpen: any;
  setRoute: any
};

const CourseDetails = ({ data, clientSecret, stripePromise, setRoute, setOpen: openAuthModal }: Props) => {
  const { data: userData, isLoading: userLoading, error: userError } = useLoadUserQuery(undefined, {});
  const [open, setOpen] = useState(false);

  // Calculate discount percentage
  const discountPercentage = data?.estimatedPrice
    ? ((data.estimatedPrice - data.price) / data.estimatedPrice) * 100
    : 0;

  const discountPercentagePrice = discountPercentage.toFixed(0);

  // Check if the user has purchased the course
  const isPurchased = userData?.user?.courses && Array.isArray(userData.user.courses) && data?._id
    ? userData.user.courses.some((item: any) => {
      const courseId = String(item.courseId || '');
      const dataId = String(data._id || '');
      const match = courseId === dataId;
      console.log('Comparing course IDs:', { courseId, dataId, match });
      return match;
    })
    : false;

  // Debugging logs in useEffect
  useEffect(() => {
    if (userLoading || userError) {
      return; // Skip logging if loading or error
    }

    console.log('=== CourseDetails Debugging Logs ===');
    console.log('Course Data:', data);
    console.log('Course Data ID:', data?._id);
    console.log('User Data:', userData);
    console.log('User:', userData?.user);
    console.log('User Courses:', userData?.user?.courses || 'No courses found');
    console.log('Course IDs in user.courses:', userData?.user?.courses ? userData.user.courses.map((item: any) => item.courseId || 'Missing ID') : 'No courses');
    console.log('Is Purchased:', isPurchased);
    if (userData?.user?.courses && Array.isArray(userData.user.courses) && data?._id) {
      userData.user.courses.forEach((item: any, index: number) => {
        const courseId = String(item.courseId || 'undefined');
        const dataId = String(data._id || 'undefined');
        console.log(`Course ${index}:`, { courseId, dataId, match: courseId === dataId });
      });
    }
    if (data?._id && isPurchased) {
      console.log('Course ID (Purchased):', data._id);
    }
  }, [data, userData, isPurchased, userLoading, userError]);

  // Handle loading state
  if (userLoading) {
    return <div>Loading user data...</div>;
  }

  // Handle error state
  if (userError) {
    console.error('User data fetch error:', userError);
    return <div>Error loading user data. Please try again.</div>;
  }

  // Log user data for debugging
  console.log('User data from API:', userData);

  console.log('isPurchased final value:', isPurchased);

  const handleOrder = (e: any) => {
    if (userData) {
      setOpen(true);
    }
  };

  return (
    <div>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5">
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          <div className="w-full 800px:w-[65%] 800px:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">{data?.name}</h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={data?.ratings} />
                <h5 className="text-black dark:text-white">{data?.reviews?.length} Reviews</h5>
              </div>
              <h5 className="text-black dark:text-white">{data?.purchased} Students</h5>
            </div>
            <br />
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What you will learn from this course?
            </h1>
            <div>
              {data?.benefits?.map((item: any, index: number) => (
                <div className="w-full flex 800px:items-center py-2" key={index}>
                  <div className="w-[15px] mr-1">
                    <IoIosCheckmarkCircleOutline size={20} className="text-black dark:text-white" />
                  </div>
                  <p className="pl-2 text-black dark:text-white">{item.title}</p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What are the prerequisites for starting this course?
            </h1>
            <div>
              {data?.prerequisites?.map((item: any, index: number) => (
                <div className="w-full flex 800px:items-center py-2" key={index}>
                  <div className="w-[15px] mr-1">
                    <IoIosCheckmarkCircleOutline size={20} className="text-black dark:text-white" />
                  </div>
                  <p className="pl-2 text-black dark:text-white">{item.title}</p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <div>
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">Course Overview</h1>
              <CourseContentList data={data?.courseData} isDemo={true} />
            </div>
            <br />
            <br />
            <div className="w-full">
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">Course Details</h1>
              <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {data?.description}
              </p>
            </div>
            <br />
            <br />
            <div className="w-full">
              <div className="800px:flex items-center">
                <Ratings rating={data?.ratings} />
                <div className="mb-2 800px:mb-[unset]">
                  <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                    {Number.isInteger(data?.ratings)
                      ? data?.ratings.toFixed(1)
                      : data?.ratings?.toFixed(2)}{' '}
                    Course Rating • {data?.reviews?.length} Reviews
                  </h5>
                </div>
              </div>
              <br />
              {data?.reviews &&
                [...data.reviews]
                  .reverse()
                  .map((item: any, index: number) => (
                    <div className="w-full pb-4" key={index}>
                      <div className="flex">
                        <div className="w-[50px] h-[50px]">
                          <Image
                            src={item?.user?.avatar?.url || userImage}
                            width={50}
                            height={50}
                            alt="user"
                            className="w-[50px] h-[50px] rounded-full object-cover"
                          />
                        </div>
                        <div className="hidden 800px:block pl-2">
                          <div className="flex items-center">
                            <h5 className="text-[18px] pr-2 text-black dark:text-white">{item.user.name}</h5>
                            <Ratings rating={item.rating} />
                          </div>
                          <p className="text-black dark:text-white">{item.comment}</p>
                          <small className="text-[#000000d1] dark:text-[#ffffff83]">
                            {format(item.createdAt)}
                          </small>
                        </div>
                        <div className="flex items-center 800px:hidden">
                          <h5 className="text-[18px] pr-2 text-black dark:text-white">{item.user.name}</h5>
                          <Ratings rating={item.rating} />
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          <div className="w-full 800px:w-[35%] relative">
            <div className="sticky top-[100px] left-0 z-50 w-full">
              <CoursePlayer videoUrl={data?.demoUrl} title={data?.name} />
              <div className="flex items-center">
                <h1 className="pt-5 text-[25px] text-black dark:text-white">
                  {data?.price === 0 ? 'Free' : data?.price + '$'}
                </h1>
                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white">
                  {data?.estimatedPrice}$
                </h5>
                <h4 className="pl-5 pt-4 text-[22px] text-black dark:text-white">
                  {discountPercentagePrice}% off
                </h4>
              </div>
              <div className="flex items-center">
                {isPurchased ? (
                  <Link href={`/course-access/${data._id}`}>
                    <button
                      type="button"
                      className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_#3b71ca,0_4px_18px_0_#3b71ca] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_#3b71ca,0_4px_18px_0_#3b71ca] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_#3b71ca,0_4px_18px_0_#3b71ca]"
                      onClick={() => console.log('Enter to Course Clicked for ID:', data._id)}
                    >
                      Enter to Course
                    </button>
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_#3b71ca,0_4px_18px_0_#3b71ca] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_#3b71ca,0_4px_18px_0_#3b71ca] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_#3b71ca,0_4px_18px_0_#3b71ca]"
                    onClick={handleOrder}
                  >
                    Buy Now
                  </button>
                )}
              </div>
              <br />
              <p className="pb-1 text-black dark:text-white">* Source code included</p>
              <p className="pb-1 text-black dark:text-white">* Full lifetime access</p>
              <p className="pb-1 text-black dark:text-white">* Certificate of completion</p>
              <p className="pb-1 text-black dark:text-white">* Premium support</p>
            </div>
          </div>
        </div>
      </div>
      {open && (
        <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
          <div className="w-[500px] min-h-[500px] bg-white rounded-xl shadow p-3">
            <div className="w-full flex justify-end">
              <IoMdClose
                size={30}
                className="text-black cursor-pointer"
                onClick={() => {
                  console.log('Checkout Modal Closed');
                  setOpen(false);
                }}
              />
            </div>
            <div className="w-full">
              {stripePromise && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckOutForm setOpen={setOpen} data={data} />
                </Elements>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;  