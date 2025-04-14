'use client'
import { UserSlicePath } from '@/app/redux/slices/UserSlice'
import CustomButton from '@/components/CustomButton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone/.'
import { IoCameraOutline } from "react-icons/io5"
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import * as yup from 'yup'

const Profile = () => {
  const user = useSelector(UserSlicePath)

  // Nếu user chưa có (null), hiển thị loading
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

  const onBasicProfileUpdateHandler = (values, helpers) => {
    try {
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
  const onDrop = useCallback(acceptedFiles => {

  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()}/>
        {
          isDragActive ? 
          <p>Drop the files here...</p> : 
          <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </div>

      <div className='relative mx-auto w-[200px] h-[200px] object-cover'>
        <img
          src='https://static.vecteezy.com/system/resources/previews/002/275/847/non_2x/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg'
          className='object-cover w-full h-full rounded-full mx-auto'
          alt='Profile'
        />
        <button className='bottom-[15px] right-0 absolute text-xl p-2 shadow text-black bg-white rounded-full'>
          <IoCameraOutline />
        </button>
      </div>
    </>
  )
}
