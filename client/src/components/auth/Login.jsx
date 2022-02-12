import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import '../../styles/Login.css'
import { useNavigate } from 'react-router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid Email')
    .required('Email required'),
  password: Yup.string()
    .required('Password required')
    .min(8, 'Password should be more than 8 characters')
})

const Login = ({ value }) => {
  const navigate = useNavigate()

  return (
    <div id='loginPage'>
      <div id='loginFormContainer'>
        <ToastContainer
          position='bottom-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          bodyStyle={{
            textAlign: 'left'
          }}
          rtl={false}
          draggable
          pauseOnHover
        />

        <h1>LOGIN</h1>
        <br />
        <div id='loginFormContent'>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              const response = await fetch('/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
              })

              const result = await response.json()

              if (result.code === 200) {
                localStorage.setItem(
                  'currentUser',
                  JSON.stringify(result.currentUser)
                )

                const imageResponse = await fetch('/allImages', {
                  method: 'post',
                  mode: 'cors',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    profileId: result.currentUser._id
                  })
                })

                const imageResults = await imageResponse.json()

                if (imageResults.code === 200) {
                  localStorage.setItem(
                    'entryImages',
                    JSON.stringify(imageResults.allImages)
                  )
                }
                navigate(`/`)
                value.setCurrentUser(result.currentUser)
              } else {
                toast.error(result.message, {
                  position: 'bottom-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined
                })
              }

              setSubmitting(false)
              resetForm()
            }}
          >
            {formik => (
              <form onSubmit={formik.handleSubmit} id='loginForm'>
                <div className='loginFieldWrapper form-group'>
                  <label className='mb-2' htmlFor='loginemail'>
                    Email address
                  </label>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    type={'email'}
                    className='form-control'
                    id='loginemail'
                    name='email'
                  />
                  {formik.errors.email && formik.touched.email && (
                    <div className='text-alert'>{formik.errors.email}</div>
                  )}
                </div>
                <br />
                <div className='form-group loginFieldWrapper'>
                  <label className='mb-2 ' htmlFor='password'>
                    Password
                  </label>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    type={'password'}
                    className='form-control'
                    id='loginpassword'
                    name='password'
                  />
                  {formik.errors.password && formik.touched.password && (
                    <div className='text-alert'>{formik.errors.password}</div>
                  )}
                </div>
                <button
                  id='loginFormSubmit'
                  type='submit'
                  className='btn btn-outline-primary'
                  disabled={formik.isSubmitting}
                >
                  LOGIN
                </button>
                <hr />
                <input
                  type={'button'}
                  id='forgotPasswordButton'
                  onClick={() => {
                    navigate('/forgot-password')
                  }}
                  className='btn link-dark'
                  value={'FORGOT PASSWORD?'}
                />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default Login
