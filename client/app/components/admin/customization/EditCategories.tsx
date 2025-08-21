import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi'
import React, { useEffect, useMemo, useState } from 'react'
import Loader from '../../Loader/Loader'
import { styles } from '../../../styles/style'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoMdAddCircleOutline } from 'react-icons/io'
import toast from 'react-hot-toast'

type Props = {}

const EditCategories = (props: Props) => {
    const { data, error, refetch } = useGetHeroDataQuery('Categories', {
        refetchOnMountOrArgChange: true,
    })

    const [editLayout, { isSuccess, isLoading }] = useEditLayoutMutation()
    const [categories, setCategories] = useState<any[]>([])
    const [originalCategories, setOriginalCategories] = useState<any[]>([])

    useEffect(() => {
        if (data) {
            setCategories(data.layout.categories)
            setOriginalCategories(data.layout.categories)
        }
    }, [data])

    useEffect(() => {
        if (isSuccess) {
            toast.success('Categories updated successfully')
            refetch()
        }
    }, [isSuccess, refetch])

    const handleCategoryChange = (id: string, value: string) => {
        setCategories(prev =>
            prev.map(c => (c._id === id ? { ...c, title: value } : c))
        )
    }

    const handleDelete = (id: string) => {
        setCategories(prev => prev.filter(c => c._id !== id))
    }

    const handleAddNew = () => {
        setCategories(prev => [
            ...prev,
            { _id: Date.now().toString(), title: '' }
        ])
    }

    const isUnchanged = useMemo(() => {
        return JSON.stringify(
            categories.map(c => ({ _id: c._id, title: c.title }))
        ) === JSON.stringify(
            originalCategories.map(c => ({ _id: c._id, title: c.title }))
        )
    }, [categories, originalCategories])

    const isAnyEmpty = useMemo(() => {
        return categories.some(c => c.title.trim() === '')
    }, [categories])

    const handleSave = async () => {
        if (isUnchanged || isAnyEmpty) return

        const payload = categories.map(c => ({ _id: c._id, title: c.title }))
        await editLayout({
            type: 'Categories',
            categories: payload
        })
    }

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="mt-[120px] text-center w-[90%] md:w-[75%] m-auto">
                    <h1 className={`${styles.title} mb-8`}>Manage Categories</h1>

                    <div className="space-y-6">
                        {categories.map((item: any, index: number) => (
                            <div
                                key={item._id}
                                className="flex items-center justify-between bg-white dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                <input
                                    className="flex-1 text-[17px] px-3 py-2 rounded-md bg-transparent outline-none border-none placeholder-gray-400 dark:text-white text-black"
                                    value={item.title}
                                    onChange={(e) => handleCategoryChange(item._id, e.target.value)}
                                    placeholder="Enter category title..."
                                />
                                <AiOutlineDelete
                                    className="text-red-500 hover:text-red-700 text-[22px] ml-4 cursor-pointer transition-transform hover:scale-110"
                                    onClick={() => handleDelete(item._id)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Add Button */}
                    <div
                        className="mt-8 flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                        onClick={handleAddNew}
                    >
                        <IoMdAddCircleOutline className="text-[26px] text-green-600" />
                        <span className="text-green-600 font-semibold text-[16px]">Add New Category</span>
                    </div>

                    {/* Save Button */}
                    <div className="w-full flex justify-end mt-10">
                        <button
                            disabled={isUnchanged || isAnyEmpty}
                            onClick={handleSave}
                            className={`transition-all px-8 py-2 rounded-xl text-white font-medium text-[16px]
                ${isUnchanged || isAnyEmpty
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#42d383]'}
              `}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default EditCategories
