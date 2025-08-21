'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Loader from '../Loader/Loader';
import CourseContentMedia from './CourseContentMedia';
import Heading from '@/app/utils/Heading';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useGetCourseContentQuery } from '@/redux/features/courses/coursesApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import Header from '../Header';
import CourseContentList from './CourseContentList';

type Props = {
  params: { id: string };
  userDataMedia: any
};

// Utility function to extract error message
const getErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined): string => {
  if (!error) return 'Unknown error';
  if ('message' in error && error.message) {
    return error.message;
  }
  if ('status' in error) {
    const fetchError = error as FetchBaseQueryError;
    if (typeof fetchError.data === 'string') {
      return fetchError.data;
    }
    if (fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data) {
      return (fetchError.data as any).message || `HTTP ${fetchError.status}`;
    }
    return `HTTP ${fetchError.status}`;
  }
  return 'Unknown error';
};

const CourseAccessPage = ({ params, userDataMedia }: Props) => {
  const router = useRouter();
  const courseId = params.id;
  const { data: userData, isLoading: userLoading, error: userError } = useLoadUserQuery(undefined, {});
  const {
    data: contentData,
    isLoading: contentLoading,
    error: contentError,
    isFetching,
    refetch
  } = useGetCourseContentQuery(courseId, {
    refetchOnMountOrArgChange: true,
  }) as {
    data: any;
    isLoading: boolean;
    error: FetchBaseQueryError | SerializedError | undefined;
    isFetching: boolean;
    refetch: () => void;
  };
  const user = userData?.user;
  // Handle response structure: check data, courseData, or content
  const data = contentData?.data ?? contentData?.courseData ?? contentData?.content;
  const [activeVideo, setActiveVideo] = useState(0);
  const [queryTimeout, setQueryTimeout] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState('Login');
  // Detect stuck queries
  useEffect(() => {
    if (contentLoading && !queryTimeout && retryCount < 3) {
      const timeout = setTimeout(() => {
        console.warn(`Course content query timed out after 10 seconds (Retry ${retryCount + 1}/3)`);
        setQueryTimeout(true);
        setRetryCount((prev) => prev + 1);
        refetch();
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [contentLoading, queryTimeout, retryCount, refetch]);

  const hasAccess = useMemo(() => {
    return user?.courses && Array.isArray(user.courses) && courseId
      ? user.courses.some((course: any) => {
        const courseIdStr = course.courseId || '';
        const paramIdStr = courseId || '';
        const match = courseIdStr === paramIdStr;
        console.log('Course access check:', { courseId: courseIdStr, paramIdStr, match });
        return match;
      })
      : false;
  }, [user, courseId]);

  useEffect(() => {
    console.log('=== CourseAccess Debugging Logs ===');
    console.log('Params:', params);
    console.log('Course ID from params:', courseId);
    console.log('User:', user);
    console.log('User Courses:', user?.courses || 'No courses found');
    console.log('Course IDs in user.courses:', user?.courses ? user.courses.map((item: any) => item.courseId || 'Missing ID') : 'No courses');
    console.log('Raw Content Data:', contentData);
    console.log('Content Data (data field):', contentData?.data);
    console.log('Content Data (courseData field):', contentData?.courseData);
    console.log('Content Data (content field):', contentData?.content);
    console.log('Final Data:', data);
    console.log('Content Loading:', contentLoading);
    console.log('Content Fetching:', isFetching);
    console.log('Content Error:', contentError);
    console.log('Query Timeout:', queryTimeout);
    console.log('Retry Count:', retryCount);
    console.log('API Request Status:', contentLoading ? 'Pending' : contentError ? 'Failed' : data ? 'Success' : 'No Data');
    console.log('Rendering Heading with title:', data && data[activeVideo]?.title ? data[activeVideo].title : 'Course Content');
    console.log('Rendering CourseContentMedia with data:', data);

    if (!courseId) {
      console.log('No course ID provided, redirecting to home');
      router.push('/');
      return;
    }

    if (userLoading || userError) {
      return; // Wait for user data to load or handle error
    }

    if (!user) {
      console.log('No user, redirecting to login');
      router.push('/login');
      return;
    }

    if (!hasAccess) {
      console.log('Unauthorized access: User has not purchased the course.', {
        userCourses: user.courses,
        courseId,
      });
      router.push('/');
    }
  }, [user, courseId, router, userLoading, userError, hasAccess, contentData, contentLoading, contentError, isFetching, queryTimeout, retryCount]);

  if (userLoading || contentLoading) {
    return <Loader />;
  }

  if (userError || contentError || (queryTimeout && retryCount >= 3)) {
    const errorMessage = (queryTimeout && retryCount >= 3) ? 'Request timed out after multiple retries' : getErrorMessage(contentError || userError);
    console.error('Error:', userError || contentError || 'Query Timeout');
    return (
      <div className="p-5 text-red-500">
        Failed to load course content: {errorMessage}. Please try again later or contact support.
      </div>
    );
  }

  if (!user || !courseId) {
    return <Loader />;
  }

  if (!data || data.length === 0) {
    console.warn('No course content available for course:', courseId);
    return (
      <div className="p-5 text-yellow-500">
        No content available for this course (ID: {courseId}). Please contact support.
      </div>
    );
  }

  return (
    <>
      {
        contentLoading ? (
          <Loader />
        ) : (
          <>
            <Header
              activeItem={1}
              open={open}
              setOpen={setOpen}
              route={route}
              setRoute={setRoute}
            />
            <div className="w-full grid 800px:grid-cols-10">
              <Heading
                title={data[activeVideo]?.title || 'Course Content'}
                description="Your course content"
                keywords={data[activeVideo]?.tags || ''}
              />
              <div className="col-span-7">
                <CourseContentMedia
                  data={data}
                  params={params}
                  activeVideo={activeVideo}
                  setActiveVideo={setActiveVideo}
                  userDataMedia={userDataMedia}
                  refetch={refetch}
                />
              </div>
              <div className="hidden 800px:block 800px:col-span-3">
                <CourseContentList
                  data={data}
                  activeVideo={activeVideo}
                  setActiveVideo={setActiveVideo}
                />
              </div>
            </div>
          </>
        )
      }
    </>
  );
};

export default CourseAccessPage;