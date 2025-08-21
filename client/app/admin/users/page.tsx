'use client'

import DashboardHero from '../../components/admin/DashboardHero'
import AdminProtected from '../../hooks/adminProtected'
import Heading from '../../utils/Heading'
import React from 'react'
import AdminSidebar from "../../components/admin/sidebar/AdminSidebar"
import AllUsers from "../../components/admin/users/AllUsers"
type Props = {}

const page = (props: Props) => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title='ELearning - Admin'
                    description="Elearning is a platform for students to learn and get varified certificates."
                    keywords="Mern Stack,React,Redux,Node,Express"
                />
                <div className="flex h-screen">
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSidebar />
                    </div>
                    <div className="w-[85%]">
                        <DashboardHero />
                        <AllUsers />
                    </div>
                </div>
            </AdminProtected>
        </div>
    )
}

export default page