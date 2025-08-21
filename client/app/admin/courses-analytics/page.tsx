'use client'
import React from 'react'
import AdminSidebar from "../../components/admin/sidebar/AdminSidebar"
import Heading from "../../utils/Heading"
import CourseAnalytics from "../../components/admin/Analytics/CourseAnalytics"
import DashboardHeader from '../../../app/components/admin/DashboardHeader'

type Props = {}

const page = (props: Props) => {
    return (
        <div>
            <Heading
                title='ELearning - Admin'
                description="Elearning is a platform for students to learn and get varified certificates."
                keywords="Mern Stack,React,Redux,Node,Express"
            />
            <div className="flex">
                <div className="1500px:w-[16%] w-1/5">
                    <AdminSidebar />
                </div>
                <div className="w-[85%]">
                    <DashboardHeader />
                    <CourseAnalytics />
                </div>
            </div>
        </div>
    )
}

export default page