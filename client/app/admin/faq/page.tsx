'use client'

import React from 'react'
import Heading from '../../utils/Heading'
import AdminSidebar from "../../components/admin/sidebar/AdminSidebar"
import AdminProtected from '../../hooks/adminProtected'
import DashboardHero from '../../components/admin/DashboardHero'
import EditFaq from '../../components/admin/customization/EditFaq'

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
                        <EditFaq/>
                    </div>
                </div>
            </AdminProtected>
        </div>
    )
}

export default page