import { MdAddCircle } from 'react-icons/md';
import { styles } from '../../../styles/style';
import React, { FC } from 'react'
import toast from 'react-hot-toast';

type Props = {
    benefits: { title: string }[];
    setBenefits: (benefits: { title: string }[]) => void;
    prerequisites: { title: string }[];
    setPrerequisites: (prerequisites: { title: string }[]) => void;
    active: number;
    setActive: (active: number) => void
}

const CourseData: FC<Props> = ({ benefits, setActive, setBenefits, setPrerequisites, prerequisites, active }) => {

    const handleBenefitChange = (index: number, value: any) => {
        const updatedBenefits = [...benefits];
        updatedBenefits[index].title = value;
        setBenefits(updatedBenefits)
    }

    const handleAddBenefits = () => {
        setBenefits([...benefits, { title: "" }])
    }

    const handlePrerequisiteChange = (index: number, value: any) => {
        const updatedPrerequisites = [...prerequisites];
        updatedPrerequisites[index].title = value;
        setPrerequisites(updatedPrerequisites)
    }

    const handlePrerequisites = () => {
        setPrerequisites([...prerequisites, { title: "" }])
    }

    const prevButton = () => {
        setActive(active - 1)
    }
    const handleOptions = () => {
        if (benefits[benefits.length - 1]?.title !== "" && prerequisites[prerequisites.length - 1]?.title !== "") {
            setActive(active + 1)
        } else {
            toast.error("Please fill the fields to go to next!")
        }
    }
    return (
        <div className='w-[80%] m-auto mt-24 block'>
            <div className="">
                <label htmlFor="email" className={`${styles.label} text-[20px]`} >
                    What are the benefits for the students in this course
                </label>
                <br />
                {
                    benefits.map((benefit: any, index: number) => (
                        <input type="text"
                            key={index}
                            name='Benefit'
                            placeholder='You will be able to build a fullstack LMS application'
                            required
                            className={`${styles.input} my-2`}
                            value={benefit.title}
                            onChange={(e) => handleBenefitChange(index, e.target.value)}
                        />
                    ))
                }
                <MdAddCircle
                    className='text-black dark:text-white'
                    style={{ margin: '10px 0px', cursor: 'pointer', width: '30px' }}
                    onClick={handleAddBenefits}
                />
            </div>

            <div className="">
                <label htmlFor="email" className={`${styles.label} text-[20px]`} >
                    What are the pre-requisites for the students in this course
                </label>
                <br />
                {
                    prerequisites.map((prerequisites: any, index: number) => (
                        <input type="text"
                            key={index}
                            name='Prerequisites'
                            placeholder='You need to the basic of fullstack'
                            required
                            className={`${styles.input} my-2`}
                            value={prerequisites.title}
                            onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                        />
                    ))
                }
                <MdAddCircle
                    className='text-black dark:text-white'
                    style={{ margin: '10px 0px', cursor: 'pointer', width: '30px' }}
                    onClick={handlePrerequisites}
                />
            </div>
            <div className="w-full flex items-center justify-between">
                <div className='w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer'
                    onClick={() => prevButton()}
                >Prev
                </div>
                <div className='w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer'
                    onClick={() => handleOptions()}
                >Next
                </div>
            </div>
        </div>
    )
}

export default CourseData