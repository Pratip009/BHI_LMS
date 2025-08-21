'use client';

import CourseAccessPage from '@/app/components/Course/CourseContent';
import Loader from '@/app/components/Loader/Loader';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import React from 'react';

type Props = {
  params: any
};

const Page = ({ params }: Props) => {
  const { isLoading, error, data } = useLoadUserQuery(undefined, {});

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return <div>Error loading user data</div>;
  }

  return (
    <div>
      <CourseAccessPage params={params} userDataMedia={data.user} />
    </div>
  );
};

export default Page;