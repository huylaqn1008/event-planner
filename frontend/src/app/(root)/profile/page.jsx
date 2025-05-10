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
import DefaultAvt from '@/assets/images/default-avt.jpg'
import Image from 'next/image'
import { useMainContext } from '@/context/MainContext'
import axios from 'axios'

const Profile = () => {
  const user = useSelector(UserSlicePath)
  const [isMounted, setIsMounted] = useState(false)

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchProvinces = async () => {
      const res = await axios.get("https://provinces.open-api.vn/api/?depth=1")
      setProvinces(res.data)
    }
    fetchProvinces()
  }, [])

  const initialValues = {
    name: user?.name || '',
    gender: user?.gender || '',
    bio: user?.bio || '',
    address: {
      province: user?.address?.province || '',
      district: user?.address?.district || '',
      ward: user?.address?.ward || '',
      street: user?.address?.street || ''
    }
  }

  const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    gender: yup.string().required('Gender is required'),
    bio: yup.string().required('Bio is required'),
    address: yup.object().shape({
      province: yup.string().required('Province is required'),
      district: yup.string().required('District is required'),
      ward: yup.string().required('Ward is required'),
      street: yup.string().required('Street is required'),
    })
  })

  const onBasicProfileUpdateHandler = async (values, helpers) => {
    try {
      // Gửi dữ liệu lên server nếu cần
      toast.success('Profile Updated!')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  // Chỉ render sau khi mounted để tránh mismatch SSR/CSR
  if (!isMounted) return null

  if (!user) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading profile...
      </div>
    )
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
          {({ handleSubmit, values, setFieldValue }) => {
            // Move the district and ward effects inside the Formik render function
            useEffect(() => {
              const selectedProvince = provinces.find(p => p.name === values.address.province)
              if (selectedProvince) {
                axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
                  .then(res => setDistricts(res.data.districts))
              }
            }, [values.address.province])

            useEffect(() => {
              const selectedDistrict = districts.find(d => d.name === values.address.district)
              if (selectedDistrict) {
                axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
                  .then(res => setWards(res.data.wards))
              }
            }, [values.address.district])

            return (
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

                {/* Tỉnh/Thành phố */}
                <div className='mb-3'>
                  <label htmlFor='province'>Tỉnh/Thành phố <span className='text-red-500'>*</span></label>
                  <Select onValueChange={(val) => setFieldValue('address.province', val)} value={values.address.province}>
                    <SelectTrigger className='w-full border border-black rounded-md'>
                      <SelectValue placeholder='Chọn tỉnh/thành phố' />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((item) => (
                        <SelectItem key={item.code} value={item.name}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage className='text-sm text-red-500' name='address.province' component='p' />
                </div>

                {/* Quận/Huyện */}
                <div className='mb-3'>
                  <label htmlFor='district'>Quận/Huyện <span className='text-red-500'>*</span></label>
                  <Select onValueChange={(val) => setFieldValue('address.district', val)} value={values.address.district}>
                    <SelectTrigger className='w-full border border-black rounded-md'>
                      <SelectValue placeholder='Chọn quận/huyện' />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((item) => (
                        <SelectItem key={item.code} value={item.name}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage className='text-sm text-red-500' name='address.district' component='p' />
                </div>

                {/* Phường/Xã */}
                <div className='mb-3'>
                  <label htmlFor='ward'>Phường/Xã <span className='text-red-500'>*</span></label>
                  <Select onValueChange={(val) => setFieldValue('address.ward', val)} value={values.address.ward}>
                    <SelectTrigger className='w-full border border-black rounded-md'>
                      <SelectValue placeholder='Chọn phường/xã' />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map((item) => (
                        <SelectItem key={item.code} value={item.name}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage className='text-sm text-red-500' name='address.ward' component='p' />
                </div>

                {/* Tên đường */}
                <div className='mb-3'>
                  <label htmlFor='street'>Tên đường <span className='text-red-500'>*</span></label>
                  <Field
                    name='address.street'
                    id='street'
                    type='text'
                    className='w-full py-2 px-4 bg-transparent border border-black outline-none rounded-md z-10'
                    placeholder='Nhập tên đường...'
                  />
                  <ErrorMessage className='text-sm text-red-500' name='address.street' component='p' />
                </div>

                <div className='mb-3'>
                  <CustomButton label={'Update Profile'} />
                </div>
              </Form>
            )
          }}
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

  const user = useSelector(UserSlicePath)
  const { fetchUserProfile } = useMainContext()

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

      const data = await res.data
      toast.success(data.msg)
      await fetchUserProfile()
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
        className={`w-full h-full rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer relative ${loading ? "opacity-50 pointer-events-none" : ""
          }`}
      >
        <input {...getInputProps()} />
        <Image
          width={1000}
          height={1000}
          src={
            previewUrl ||
            (user?.image || DefaultAvt.src)
          }
          className="w-full h-full object-cover"
          alt="Profile Avt"
          onError={(e) => {
            e.target.src = DefaultAvt.src // Fallback nếu ảnh chính bị lỗi
          }}
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