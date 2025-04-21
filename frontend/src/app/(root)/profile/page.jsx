'use client'
import { UserSlicePath } from '@/app/redux/slices/UserSlice'
import CustomButton from '@/components/CustomButton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { axiosClient } from '@/utils/AxiosClient'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { IoCameraOutline } from "react-icons/io5"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import * as yup from 'yup'

const Profile = () => {
  const user = useSelector(UserSlicePath)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Chỉ render sau khi mounted để tránh mismatch SSR/CSR
  if (!isMounted) return null

  if (!user) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading profile...
      </div>
    )
  }

  const initialValues = {
    name: user.name || '',
    gender: user.gender || '',
    bio: user.bio || ''
  }

  const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    gender: yup.string().required('Gender is required'),
    bio: yup.string().required('Bio is required')
  })

  const onBasicProfileUpdateHandler = async (values, helpers) => {
    try {
      // Gửi dữ liệu lên server nếu cần
      toast.success('Profile Updated!')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <div className='mb-3 mt-2 w-full mx-auto'>
      <ImageUploadComponent />
      <div className='w-full py-10'>
        <Formik
          onSubmit={onBasicProfileUpdateHandler}
          validationSchema={validationSchema}
          initialValues={initialValues}
        >
          {({ handleSubmit, values, setFieldValue }) => (
            <Form onSubmit={handleSubmit} className='w-[96%] lg:w-1/2 2xl:w-1/3 mx-auto'>
              <div className='mb-3'>
                <label htmlFor='name'>
                  Name <span className='text-red-500'>*</span>
                </label>
                <Field
                  name='name'
                  id='name'
                  type='text'
                  className='w-full py-2 px-4 bg-transparent border border-black outline-none rounded-md z-10'
                  placeholder='Enter Your Name...'
                />
                <ErrorMessage className='text-sm text-red-500' name='name' component='p' />
              </div>

              <div className='mb-3'>
                <label htmlFor='email'>
                  Email <span className='text-red-500'>*</span>
                </label>
                <input
                  name='email'
                  id='email'
                  readOnly
                  defaultValue={user.email}
                  className='w-full py-2 px-4 bg-transparent border border-black outline-none rounded-md z-10'
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='gender'>
                  Gender <span className='text-red-500'>*</span>
                </label>
                <Select onValueChange={(gender) => setFieldValue('gender', gender)} defaultValue={values.gender}>
                  <SelectTrigger className='w-full py-2 px-4 bg-transparent border border-black outline-none rounded-md z-10'>
                    <SelectValue placeholder='Select Gender' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="male" value="male">Male</SelectItem>
                    <SelectItem key="female" value="female">Female</SelectItem>
                    <SelectItem key="other" value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage className='text-sm text-red-500' name='gender' component='p' />
              </div>

              <div className='mb-3'>
                <label htmlFor='bio'>
                  Bio <span className='text-red-500'>*</span>
                </label>
                <Textarea
                  id='bio'
                  placeholder='Describe yourself in simple words...'
                  className='resize-none w-full py-2 px-4 bg-transparent border border-black outline-none rounded-md z-10'
                  onChange={(e) => setFieldValue('bio', e.target.value)}
                  value={values.bio}
                />
              </div>

              <div className='mb-3'>
                <CustomButton label={'Update Profile'} />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Profile

const ImageUploadComponent = () => {
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  const updateProfileAvatar = async (file) => {
    setLoading(true)
    try {
      const form_data = new FormData()
      form_data.append("image", file)

      const res = await axiosClient.put("/auth/update-avatar", form_data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      })

      await res.data
      toast.success("Avatar updated!")
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      updateProfileAvatar(file)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div className="relative w-[200px] h-[200px] mx-auto">
      <div
        {...getRootProps()}
        className={`w-full h-full rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer relative ${
          loading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <input {...getInputProps()} />
        <img
          src={
            previewUrl ||
            "https://static.vecteezy.com/system/resources/previews/002/275/847/non_2x/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg"
          }
          className="w-full h-full object-cover"
          alt="Profile"
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-20">
            <AiOutlineLoading3Quarters className="animate-spin text-2xl text-gray-700" />
          </div>
        )}
      </div>

      <button
        className="absolute bottom-0 right-5 text-xl p-2 shadow text-black bg-white rounded-full z-10"
        onClick={(e) => {
          e.stopPropagation()
          if (!loading) document.querySelector('input[type="file"]').click()
        }}
        disabled={loading}
      >
        <IoCameraOutline />
      </button>
    </div>
  )
}
