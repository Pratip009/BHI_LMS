/* eslint-disable @next/next/no-img-element */
import { styles } from '../../../styles/style'
import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi'
import React, { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineCamera } from 'react-icons/ai'

type Props = {}

const EditHero: FC<Props> = () => {
    const [image, setImage] = useState("")
    const [title, setTitle] = useState("")
    const [subTitle, setSubTitle] = useState("")

    const { data, error, refetch } = useGetHeroDataQuery("Banner", {
        refetchOnMountOrArgChange: true
    })

    const [editLayout, { isSuccess, isError, isLoading }] = useEditLayoutMutation()

    useEffect(() => {
        if (data?.layout?.banner) {
            setTitle(data.layout.banner.title)
            setSubTitle(data.layout.banner.subTitle)
            setImage(data.layout.banner.image?.url)
        }
        if (isSuccess) {
            refetch()
            toast.success("Hero updated successfully")
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message)
            }
        }

    }, [data, isSuccess, error, refetch])

    const handleUpdate = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = (e: any) => {
                if (reader.readyState === 2) {
                    setImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }

    }

    const handleEdit = async () => {
        await editLayout({
            type: "Banner",
            image,
            title,
            subTitle
        })
    }

    const hasChanged =
        data?.layout?.banner?.title !== title ||
        data?.layout?.banner?.subTitle !== subTitle ||
        data?.layout?.banner?.image?.url !== image

    return (
        <div className="w-full min-h-screen flex flex-col 1000px:flex-row items-center justify-center gap-12 px-4 py-8 bg-gray-50 dark:bg-[#111]">
            {/* Image Section */}
            <div className="relative w-[300px] h-[300px] rounded-full bg-gray-200 overflow-hidden shadow-lg flex items-center justify-center">
                {image ? (
                    <img
                        src={image}
                        alt="hero"
                        className="w-full h-full object-cover z-10"
                    />
                ) : (
                    <p className="text-gray-500">No image found</p>
                )}

                <input
                    type="file"
                    id="banner"
                    accept="image/*"
                    onChange={handleUpdate}
                    className="hidden"
                />

                {/* Camera Icon Overlay */}
                <label
                    htmlFor="banner"
                    className="absolute bottom-4 right-30 z-20 bg-white dark:bg-[#222] border border-gray-300 dark:border-gray-700 p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-500 hover:text-white transition duration-200"
                >
                    <AiOutlineCamera className="text-black dark:text-white text-[20px]" />
                </label>
            </div>



            {/* Text Section */}
            <div className="w-full max-w-[600px] text-center 1000px:text-left">
                <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full min-h-[80px] bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 text-[30px] font-bold dark:text-white text-black resize-none overflow-hidden"
                    placeholder="Title"
                />
                <br />
                <br />
                <br />
                <textarea
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    className="w-full min-h-[120px] bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 text-[20px] font-semibold dark:text-white text-black resize-none overflow-hidden"
                    placeholder="Sub Title"
                />
                <br />
                <br />
                <br />
                <br />
                <div
                    className={`${styles.button} !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] ${hasChanged
                        ? "!cursor-pointer !bg-[#42d383]"
                        : "!cursor-not-allowed"
                        } !rounded mt-6`}
                    onClick={hasChanged ? handleEdit : () => null}
                >
                    Save
                </div>
            </div>
        </div>
    )
}

export default EditHero
