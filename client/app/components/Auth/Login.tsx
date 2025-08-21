'use client'

import React, { FC, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from '../../styles/style';
import { useLoginMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react'


type Props = {
    setRoute: (route: string) => void;
    setOpen: (open: boolean) => void
}

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid Email!").required("Please enter your email!"),
    password: Yup.string().required("Please enter your password!").min(6, "Password must be at least 6 characters"),
})

const Login: FC<Props> = ({ setRoute, setOpen }) => {
    const [show, setShow] = useState(false);

    const [login, { isSuccess, error, data }] = useLoginMutation()

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ email, password }) => {
            await login({ email, password })
        }
    });

    useEffect(() => {
        if (isSuccess) {
            toast.success('Login successfull!')
            setOpen(false);
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message)
            }
        }
    }, [isSuccess, error])


    const { errors, touched, values, handleChange, handleBlur, handleSubmit } = formik;

    return (
        <div className='w-full'>
            <h1 className={`${styles.title}`}>
                Login with ELearning
            </h1>
            <form onSubmit={handleSubmit}>
                {/* Email Field */}
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
                    {show ? (
                        <AiOutlineEye
                            className='absolute bottom-3 right-2 z-1 cursor-pointer'
                            size={20}
                            onClick={() => setShow(false)}
                        />
                    ) : (
                        <AiOutlineEyeInvisible
                            className='absolute bottom-3 right-2 z-1 cursor-pointer'
                            size={20}
                            onClick={() => setShow(true)}
                        />
                    )}

                </div>
                {errors.password && touched.password && (
                    <span className='text-red-500 pt-2 block'>{errors.password}</span>
                )}
                {/* Login Button */}
                <div className='w-full mt-5'>
                    <button type='submit' className={`${styles.button}`}>
                        Login
                    </button>
                </div>

                <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>
                    Or join with
                </h5>
                <div className='flex items-center justify-center my-3'>
                    <FcGoogle size={30} className='cursor-pointer mr-2'
                        onClick={() => signIn('google')}
                    />
                </div>

                {/* Sign-Up Redirect */}
                <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>
                    Not have any account?
                    <span className='text-[#2190ff] pl-1 cursor-pointer' onClick={() => setRoute("Sign-Up")}>
                        Sign up
                    </span>
                </h5>
            </form>
        </div>
    )
}

export default Login;
