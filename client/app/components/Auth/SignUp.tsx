
'use client'

import React, { FC, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from '../../styles/style';
import { useRegisterMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';

type Props = {
    setRoute: (route: string) => void
}

const schema = Yup.object().shape({
    name: Yup.string().required('Please enter your name!'),
    email: Yup.string().email("Invalid Email!").required("Please enter your email!"),
    password: Yup.string().required("Please enter your password!").min(6, "Password must be at least 6 characters"),
})

const SignUp: FC<Props> = ({ setRoute }) => {
    const [show, setShow] = useState(false);
    const [register, { data, error, isSuccess }] = useRegisterMutation()

    useEffect(() => {
        if (isSuccess) {
            const message = data?.message || 'Registration successful';
            toast.success(message);
            setRoute("Verification")
        }
        if (error) {
            if ('data' in error) {
                const errorData = error as any;
                toast.error(errorData.data.message)
            }
        }
    }, [isSuccess, error, data?.message, setRoute])


    const formik = useFormik({
        initialValues: { name: "", email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ name, email, password }) => {
            const data = {
                name, email, password
            }
            await register(data)
        }
    })

    const { errors, touched, values, handleChange, handleBlur, handleSubmit } = formik;

    return (
        <div className='w-full'>
            <h1 className={`${styles.title}`}>
                Join to ELearning
            </h1>
            <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className='w-full mt-5 relative mb-1'>
                    <label className={`${styles.label}`} htmlFor='name'>
                        Enter your Name
                    </label>
                    <input
                        type='text'
                        name='name'
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        id='name'
                        placeholder='John Doe'
                        className={`${styles.input} ${errors.name && touched.name ? "border-red-500" : ""}`}
                    />
                    {errors.name && touched.name && (
                        <span className='text-red-500 pt-2 block'>{errors.name}</span>
                    )}
                </div>

                {/* Email Field */}
                <div className='w-full mt-5 relative mb-1'>
                    <label className={`${styles.label}`} htmlFor='email'>
                        Enter your Email
                    </label>
                    <input
                        type='email'
                        name='email'
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        id='email'
                        placeholder='loginmail@gmail.com'
                        className={`${styles.input} ${errors.email && touched.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && touched.email && (
                        <span className='text-red-500 pt-2 block'>{errors.email}</span>
                    )}
                </div>

                {/* Password Field */}
                <div className='w-full mt-5 relative mb-1'>
                    <label className={`${styles.label}`} htmlFor='password'>
                        Enter your Password
                    </label>
                    <input
                        type={!show ? "password" : "text"}
                        name='password'
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        id='password'
                        placeholder='Password!2@'
                        className={`${styles.input} ${errors.password && touched.password ? "border-red-500" : ""}`}
                    />
                    {!show ? (
                        <AiOutlineEyeInvisible
                            className='absolute bottom-3 right-2 z-1 cursor-pointer'
                            size={20}
                            onClick={() => setShow(true)}
                        />
                    ) : (
                        <AiOutlineEye
                            className='absolute bottom-3 right-2 z-1 cursor-pointer'
                            size={20}
                            onClick={() => setShow(false)}
                        />
                    )}

                </div>
                {errors.password && touched.password && (
                    <span className='text-red-500 pt-2 block'>{errors.password}</span>
                )}
                {/* Submit Button */}
                <div className='w-full mt-5'>
                    <input
                        type='submit'
                        value='Sign Up'
                        className={`${styles.button}`}
                    />
                </div>

                <br />
                <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>
                    Or join with
                </h5>
                <div className='flex items-center justify-center my-3'>
                    <FcGoogle size={30} className='cursor-pointer mr-2' />
                </div>
                <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>
                    Already have any account?
                    <span className='text-[#2190ff] pl-1 cursor-pointer'
                        onClick={() => setRoute("Login")}
                    >
                        Sign in
                    </span>
                </h5>
                <br />
            </form>
        </div>
    )
}

export default SignUp;
