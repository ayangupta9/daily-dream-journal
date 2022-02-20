import { Formik } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import '../../styles/Signup.css'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoadingModal from '../utils/LoadingModal'

const SignUpSchema = Yup.object().shape({
  username: Yup.string()
    .min(5, 'Too short!')
    .max(20, 'Too Long!')
    .required('Username required'),
  email: Yup.string()
    .email('Invalid Email')
    .required('Email required'),
  password: Yup.string()
    .required('Password required')
    .min(8, 'Password should be more than 8 characters')
})

const Signup = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <div id='signupPage'>
      <LoadingModal open={open} />

      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />

      <div id='signupFormContainer'>
        <h1>SIGNUP</h1>
        <br />
        <div id='signupFormContent'>
          <Formik
            initialValues={{ username: '', email: '', password: '' }}
            validationSchema={SignUpSchema}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              setOpen(true)

              const response = await fetch('/signup', {
                method: 'POST',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
              })

              const result = await response.json()
              resetForm()

              if (result.code === 401 || result.code === 404) {
                setOpen(false)

                toast.error(result.message)
              } else if (result.code === 200) {
                setOpen(false)
                toast.success(result.message, {
                  position: 'bottom-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined
                })
                setSubmitting(false)
                navigate('/login')
              }
            }}
          >
            {formik => (
              <form onSubmit={formik.handleSubmit} id='signupForm'>
                <div className='signupfieldwrapper form-group'>
                  <label className='mb-2' htmlFor='username'>
                    Username
                  </label>
                  <input
                    value={formik.values.username}
                    type={'text'}
                    className='form-control'
                    id='signupusername'
                    name='username'
                    onChange={formik.handleChange}
                  />
                  {formik.errors.username && formik.touched.username ? (
                    <div className='text-danger'>{formik.errors.username}</div>
                  ) : null}
                </div>

                <br />

                <div className='signupfieldwrapper form-group'>
                  <label className='mb-2' htmlFor='email'>
                    Email address
                  </label>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    type={'email'}
                    className='form-control'
                    id='signupemail'
                    name='email'
                  />

                  {formik.errors.email && formik.touched.email ? (
                    <div className='text-danger'>{formik.errors.email}</div>
                  ) : null}
                </div>

                <br />

                <div className='signupfieldwrapper form-group'>
                  <label className='mb-2 ' htmlFor='password'>
                    Password
                  </label>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    type={'password'}
                    className='form-control'
                    id='signuppassword'
                    name='password'
                  />

                  {formik.errors.password && formik.touched.password ? (
                    <div className='text-danger'>{formik.errors.password}</div>
                  ) : null}
                </div>
                <button
                  disabled={formik.isSubmitting}
                  type='submit'
                  id='signupSubmitButton'
                  className='btn btn-outline-danger'
                >
                  SIGN UP
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default Signup
