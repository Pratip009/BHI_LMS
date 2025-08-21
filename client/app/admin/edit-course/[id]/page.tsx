'use client'
import React from 'react'
import AdminSidebar from "../../../components/admin/sidebar/AdminSidebar"
import Heading from "../../../utils/Heading"

import DashboardHeader from '../../../../app/components/admin/DashboardHeader'
import EditCourse from '../../../components/admin/course/EditCourse'
type Props = {}

const page = ({ params }: any) => {
    const id = params?.id
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
                    {/* <CreateCourse /> */}
                    <EditCourse id={id} />
                </div>
            </div>
        </div>
    )
}

export default page