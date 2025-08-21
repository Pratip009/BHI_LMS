import { styles } from '@/app/styles/style';
import Image from 'next/image';
import React from 'react'
import ReviewCard from "../Review/ReviewCard";
type Props = {}

export const reviews = [
    {
        name: "Sophie Bennett",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        profession: "Digital Marketer",
        comment: "This course exceeded my expectations in every way. The instructor's explanations were clear, concise, and very well-structured. I now feel much more confident managing digital campaigns and analyzing performance data effectively."
    },
    {
        name: "Liam Carter",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        profession: "Frontend Developer",
        comment: "I really enjoyed the hands-on approach of this course. The practical projects helped solidify my understanding, and it was great to see modern tools like React and Redux being used in real-world scenarios."
    },
    {
        name: "Ava Thompson",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        profession: "UX Designer",
        comment: "Loved how practical the lessons were. As someone from a design background, I appreciated how the course tied together design thinking with user-centered development practices. It's helped me collaborate better with developers."
    },
    {
        name: "Noah Evans",
        avatar: "https://randomuser.me/api/portraits/men/76.jpg",
        profession: "Software Engineer",
        comment: "The course pace was perfect—not too fast, not too slow. I especially appreciated the clear explanations on APIs and integration techniques, which are often glossed over in other courses."
    },
    {
        name: "Isabella Hughes",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg",
        profession: "Content Strategist",
        comment: "Fantastic course for marketers looking to upskill. The way it explained SEO, content marketing, and analytics was incredibly clear and actionable. I already see improvements in my campaign strategies."
    },
    {
        name: "James Wilson",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        profession: "SEO Specialist",
        comment: "I've taken a lot of marketing courses, but this one stood out. The analytics module alone was worth the price. Clear dashboards, strong strategy, and up-to-date tools throughout."
    },
    {
        name: "Mia Robinson",
        avatar: "https://randomuser.me/api/portraits/women/34.jpg",
        profession: "Entrepreneur",
        comment: "As a small business owner, I found this course extremely helpful. It explained complex ideas in a digestible way, and the real-life examples made it easy to apply what I learned directly to my business."
    },
    {
        name: "Lucas Walker",
        avatar: "https://randomuser.me/api/portraits/men/60.jpg",
        profession: "Backend Developer",
        comment: "Even though I come from a backend background, I learned a lot about how to build seamless full-stack apps. The way the instructor broke down frontend integration was very helpful."
    },
    {
        name: "Charlotte Scott",
        avatar: "https://randomuser.me/api/portraits/women/18.jpg",
        profession: "Marketing Manager",
        comment: "Very informative and highly relevant to today’s marketing landscape. From automation to social media strategy, the lessons were both comprehensive and easy to implement right away."
    },
    {
        name: "Henry Green",
        avatar: "https://randomuser.me/api/portraits/men/12.jpg",
        profession: "Business Analyst",
        comment: "A well-structured and insightful course. It connected the dots between data, development, and business strategy perfectly. I’ve already recommended it to several colleagues."
    }
];


const Reviews = (props: Props) => {

    return (
        <div className='w-[90%] 800px:w-[85%] m-auto'>
            <div className="w-full 800px:flex items-center">
                <div className="800px:w-[50%] w-full">
                    <Image
                        src={require("../../../public/images/businees.png")}
                        alt='business'
                        width={700}
                        height={700}
                    />
                </div>
                <div className="800px:w-[50%] w-full">
                    <h3 className='text-center font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] text-[#000] font-[700] tracking-tight'>Our Students Are <span className='bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent'>Our Strength</span><br />See Wht They Say About US</h3>
                    <br />
                    <p className={`${styles.label} !text-center`}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using &#39;Content here, content here&lsquo;, making it look like readable English. </p>
                </div>
                <br />
                <br />

            </div>
            <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[25px] mb-12 border-0 md:[&>*:nth-child(3)]:!mt-[-60px] md:[&>*:nth-child(6)]:!mt-[-40px]">
                {reviews && reviews.map((i, index) => <ReviewCard key={index} item={i} />)}
            </div>
        </div>
    )
}

export default Reviews