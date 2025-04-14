"use client"
import CustomButton from '@/components/CustomButton'
import { useMainContext } from '@/context/MainContext'
import { axiosClient } from '@/utils/AxiosClient'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import * as yup from 'yup'

const LoginPage = () => {
    const { fetchUserProfile } = useMainContext()

    const [isHide, setIsHide] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const initialValues = {
        email: '',
        password: ''
    }

    const validationSchema = yup.object({
        email: yup.string().email('Invalid email request').required('Email is required'),
        password: yup.string()
            .min(8, 'Password must be at least 8 characters long')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
            .required('Password is required')
    })

    const onSubmitHandler = async (values, helpers) => {
        try {
            setIsLoading(true)
            const res = await axiosClient.post("http://192.168.1.13:1234/api/v1/auth/login", values)
            const data = await res.data
            toast.success(data.msg)
    
            localStorage.setItem("token", data.token)
            // Đợi cho việc fetch profile hoàn thành trước khi chuyển hướng
            await fetchUserProfile()
            router.push("/")
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className='flex min-h-[80vh] justify-center items-center'>
                <Formik onSubmit={onSubmitHandler} validationSchema={validationSchema} initialValues={initialValues}>
                    {() => (
                        <Form className='w-[96%] xl:w-1/2 2xl:w-1/3 shadow border border-sky-400 bg-white/5 py-10 px-10 rounded-md mx-auto'>
                            <div className='mb-3'>
                                <label htmlFor='email'>Email</label>
                                <Field
                                    type='email'
                                    id='email'
                                    name='email'
                                    className='w-full py-3 bg-transparent rounded-md border border-indigo-300 outline-none px-2'
                                    placeholder='Enter Your Email'
                                />
                                <ErrorMessage className='text-sm text-red-500' component={'p'} name='email' />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='password'>Password</label>
                                <div className='flex items-center justify-center gap-x-2 border border-indigo-300 rounded-md px-2'>
                                    <Field
                                        type={isHide ? 'password' : 'text'}
                                        id='password'
                                        name='password'
                                        className='w-full py-3 bg-transparent outline-none'
                                        placeholder='Enter Your Password'
                                    />
                                    {
                                        isHide ? <FaEye onClick={() => setIsHide(!isHide)} className='text-3xl text-primary' /> :
                                            <FaEyeSlash onClick={() => setIsHide(!isHide)} className='text-3xl text-primary' />
                                    }
                                </div>
                                <ErrorMessage className='text-sm text-red-500' component={'p'} name='password' />
                            </div>
                            <div className='mb-3'>
                                <CustomButton type='submit' isLoading={isLoading} label={'Login'} />
                            </div>
                            <div className='mb-3'>
                                <p className='text-end text-indigo-500'>
                                    Don't Have An Account ? <Link href={'/register'} className='text-indigo-800 font-psmbold'>Register</Link>
                                </p>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}

export default LoginPage