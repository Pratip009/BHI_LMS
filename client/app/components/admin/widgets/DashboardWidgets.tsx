import React, { FC } from 'react';
import UserAnalytics from '../Analytics/UserAnalytics';
import { BiBorderLeft } from 'react-icons/bi';
import { PiUsersFourLight } from 'react-icons/pi';
import { Box, CircularProgress } from '@mui/material';
import OrderAnalytics from '../Analytics/OrderAnalytics';
import AllInvoices from "../Order/AllInvoices";

type Props = {
    open?: boolean;
    value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ open, value = 100 }) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant="determinate"
                value={value}
                size={40}
                thickness={4}
                color="info"
                style={{ zIndex: open ? -1 : 1 }}
            />
        </Box>
    );
};

const DashboardWidgets: FC<Props> = ({ open, value }) => {
    return (
        <div className="dark:bg-[#0b1120] bg-[#fff] pt-[90px] px-10 pb-8">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Analytics Chart Section */}
                <div className="dark:bg-[#0e1a38] bg-[#fff] rounded-lg p-4 shadow-md flex-1 h-[280px] flex flex-col">
                    <h2 className="dark:text-white text-black font-semibold mb-3 text-lg">Users Analytics</h2>
                    <div className="flex-1">
                        <UserAnalytics isDashboard={true} />
                    </div>
                </div>

                {/* Stat Cards Column */}
                <div className="flex flex-col gap-4 w-full lg:w-[30%]">
                    {/* Sales Card */}
                    <div className="dark:bg-[#0e1a38] bg-[#fff] rounded-lg p-3 shadow-md flex items-center justify-between h-[130px]">
                        <div className="flex flex-col items-start gap-1">
                            <BiBorderLeft className="text-[#45cba0] text-[24px]" />
                            <div>
                                <h3 className="dark:text-white text-black text-lg font-semibold">120</h3>
                                <p className="text-[#45cba0] text-sm">Sales Obtained</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <CircularProgressWithLabel value={value} open={open} />
                            <p className="text-green-400 text-xs mt-1 font-medium">+120%</p>
                        </div>
                    </div>

                    {/* New Users Card */}
                    <div className="dark:bg-[#0e1a38] bg-[#fff] rounded-lg p-3 shadow-md flex items-center justify-between h-[130px]">
                        <div className="flex flex-col items-start gap-1">
                            <PiUsersFourLight className="text-[#45cba0] text-[24px]" />
                            <div>
                                <h3 className="dark:text-white text-black text-lg font-semibold">450</h3>
                                <p className="text-[#45cba0] text-sm">New Users</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <CircularProgressWithLabel value={value} open={open} />
                            <p className="text-green-400 text-xs mt-1 font-medium">+150%</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-[20px]">
                {/* Order Analytics Chart - Left Side (2/3 width) */}
                <div className="lg:col-span-2 h-[420px] bg-white dark:bg-[#0b1120] rounded-lg shadow-md p-5">
                    <OrderAnalytics isDashboard={true} />
                </div>

                {/* Recent Transactions - Right Side (1/3 width) */}
                <div className="h-[420px] bg-white dark:bg-[#0b1120] rounded-lg shadow-md p-5 flex flex-col">
                    <h5 className="text-[18px] font-[400] font-Poppins pb-2 dark:text-white text-black">Recent Transactions</h5>
                    <div className="flex-1">
                        <AllInvoices isDashboard={true} />
                    </div>
                </div>
            </div>



        </div>
    );
};

export default DashboardWidgets;
