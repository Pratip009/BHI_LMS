'use client'
import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { useTheme } from 'next-themes'
import { useGetAllOrdersQuery } from '@/redux/features/orders/ordersApi'
import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi'
import { useGetAllUserQuery } from '@/redux/features/user/userApi'
import Loader from '../../Loader/Loader'
import { format } from 'timeago.js'
import { AiOutlineMail } from 'react-icons/ai'

type Props = {
    isDashboard?: boolean
}

const AllInvoices = ({ isDashboard }: Props) => {
    const { theme } = useTheme()
    const { isLoading, data } = useGetAllOrdersQuery({})
    const { data: coursesData } = useGetAllCoursesQuery({})
    const { data: usersData } = useGetAllUserQuery({})
    const [orderData, setOrderData] = useState<any[]>([])

    useEffect(() => {
        if (data?.orders && usersData?.users && coursesData?.courses) {
            const formatted = data.orders.map((item: any) => {
                const user = usersData.users.find((u: any) => u._id === item.userId)
                const course = coursesData.courses.find((c: any) => c._id === item.courseId)
                return {
                    id: item._id,
                    userName: user?.name || 'N/A',
                    userEmail: user?.email || 'N/A',
                    title: course?.name || 'N/A',
                    price: `$${course?.price ?? '0'}`,
                    created_at: format(item.createdAt),
                }
            })
            setOrderData(formatted)
        }
    }, [data, usersData, coursesData])

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'userName', headerName: 'Name', flex: 0.7 },
        ...(isDashboard ? [] : [
            { field: 'userEmail', headerName: 'Email', flex: 1 },
            { field: 'title', headerName: 'Course Title', flex: 1 },
        ]),
        { field: 'price', headerName: 'Price', flex: 0.5 },
        ...(isDashboard
            ? [{ field: 'created_at', headerName: 'Created At', flex: 0.6 }]
            : [{
                field: 'emailAction',
                headerName: 'Email',
                flex: 0.2,
                sortable: false,
                renderCell: (params: any) => (
                    <a href={`mailto:${params.row.userEmail}`}>
                        <AiOutlineMail className="text-black dark:text-white" size={20} />
                    </a>
                )
            }]
        ),
    ]

    return (
        <div
            className="h-full"
            style={{
                marginTop: isDashboard ? 0 : '100px',
                paddingLeft: isDashboard ? 0 : '20px'
            }}
        >
            {isLoading ? (
                <Loader />
            ) : (
                <Box
                    sx={{
                        height: isDashboard ? '375px' : '100% !important',
                        '& .MuiDataGrid-root': {
                            border: 'none',
                            outline: 'none',
                        },
                        '& .MuiDataGrid-row': {
                            color: theme === 'dark' ? '#fff' : '#000',
                            borderBottom: theme === 'dark'
                                ? '1px solid #ffffff30 !important'
                                : '1px solid #ccc !important',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: theme === 'dark' ? '#fff' : '#a4a9fc',
                            color: '#000',
                            fontSize: '14px',
                            borderBottom: 'none',
                        },
                        '& .MuiDataGrid-virtualScroller': {
                            backgroundColor: theme === 'dark' ? '#1F2A40' : '#f9f9f9',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            display: 'none',
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: 'none !important',
                        },
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    <DataGrid
                        rows={orderData}
                        columns={columns}
                        checkboxSelection={false}
                        disableRowSelectionOnClick
                    />
                </Box>
            )}
        </div>
    )
}

export default AllInvoices
