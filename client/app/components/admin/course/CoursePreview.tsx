import React, { FC } from 'react';
import CoursePlayer from '../../../utils/CoursePlayer';
import { styles } from '../../../styles/style';
import Ratings from "../../../utils/Ratings"
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

type Props = {
    active: number;
    setActive: (active: number) => void;
    courseData: any;
    handleCourseCreate: any;
    isEdit?: boolean
};

const CoursePreview: FC<Props> = ({
    active,
    setActive,
    courseData,
    handleCourseCreate,
    isEdit
}) => {
    const discountPercentage = ((courseData?.estimatedPrice - courseData?.price) / courseData?.estimatedPrice) * 100;
    const discountPercentagePrice = discountPercentage.toFixed(0);


    const prevButton = () => {
        setActive(active - 1)
    }

    const CreateCourse = () => {
        handleCourseCreate()
    }
    return (
        <div className='w-[90%] m-auto py-5 mb-5'>
            <div className='w-full relative'>
                <div className='w-full mt-10'>
                    <CoursePlayer videoUrl={courseData?.demoUrl} title={courseData?.title} />
                </div>
                <div className='flex items-center'>
                    <h1 className='pt-5 text-[25px] text-black dark:text-white'>
                        {courseData?.price === 0 ? 'Free' : courseData?.price + '$'}
                    </h1>
                    <h5 className='pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white'>
                        {courseData?.estimatedPrice}$
                    </h5>
                    <h4 className='pl-5 pt-4 text-[22px] text-red-500 font-semibold'>
                        {discountPercentagePrice}% off
                    </h4>
                </div>
                <div className='flex items-center'>
                    <div className={`${styles.button} !w-[180px] my-3 font-Poppins !bg-[crimson] cursor-not-allowed`}>
                        Buy Now {courseData?.price}$
                    </div>
                </div>
                <div className='flex items-center gap-3 mt-3'>
                    <input
                        type='text'
                        placeholder='Discount Code...'
                        className={`${styles.input} w-[60%] 1500px:w-[50%]`}
                    />
                    <div className={`${styles.button} !w-[120px] font-Poppins cursor-pointer`}>Apply</div>
                </div>
                <br />
                <p className="pb-1 text-black dark:text-white">• Source code included</p>
                <p className="pb-1 text-black dark:text-white">• Full lifetime access</p>
                <p className="pb-1 text-black dark:text-white">• Certificate of completion</p>
                <p className="pb-3 800px:pb-1 text-black dark:text-white">• Premium Support</p>
            </div>
            <br />
            <div className="w-full">
                <div className="w-full 800px:pr-5">
                    <h1 className='text-[25px] font-Poppins font-[600] text-black dark:text-white'>
                        {courseData?.name}
                    </h1>
                    <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center">
                            <Ratings rating={0} />
                            <h5 className='text-black dark:text-white'>0 Reviews</h5>
                        </div>
                        <h5 className='text-black dark:text-white'>0 Student</h5>
                    </div>
                    <br />
                    <h1 className='text-[25px] font-Poppins font-[600] text-black dark:text-white'>What will you learn from this course?</h1>

                </div>
                {
                    courseData?.benefits?.map((item: any, index: number) => (
                        <div className="w-full flex 800px:items-center py-2" key={index}>
                            <div className="w-[15px] mr-1">
                                <IoMdCheckmarkCircleOutline size={20} className='text-black dark:text-white' />
                            </div>
                            <p className='pl-2 text-black dark:text-white'>{item.title}</p>
                        </div>
                    ))
                }

                <br />


                <h1 className='text-[25px] font-Poppins font-[600] text-black dark:text-white'>What are the pre-requisites for starting this course?</h1>
                {
                    courseData?.prerequisites?.map((item: any, index: number) => (
                        <div className="w-full flex 800px:items-center py-2" key={index}>
                            <div className="w-[15px] mr-1">
                                <IoMdCheckmarkCircleOutline size={20} className='text-black dark:text-white' />
                            </div>
                            <p className='pl-2 text-black dark:text-white'>{item.title}</p>
                        </div>
                    ))
                }
                <br />
                <br />

                <div className="w-full">
                    <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                        Course Details
                    </h1>
                    <p className='text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden'>
                        {courseData?.description}
                    </p>

                </div>
                <br />
                <br />

            </div>
            <div className="w-full flex items-center justify-between">
                <div className='w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer'
                    onClick={() => prevButton()}
                >Prev
                </div>
                <div className='w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer'
                    onClick={() => CreateCourse()}
                >
                    {
                        isEdit? "Update": "Create"
                    }
                </div>
            </div>
        </div>
    );
};

export default CoursePreview;
