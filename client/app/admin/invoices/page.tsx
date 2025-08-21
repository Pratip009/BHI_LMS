'use client'
import React from 'react'
import AdminSidebar from "../../components/admin/sidebar/AdminSidebar"
import Heading from "../../utils/Heading"

import DashboardHeader from '../../../app/components/admin/DashboardHeader'
import AllInvoices from '../../components/admin/Order/AllInvoices'

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
                <div className="w-[85%] h-100vh">
                    <DashboardHeader />
                    <div className="mt-[120px] pl-10">
                        <AllInvoices isDashboard={true} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page