import React, { useEffect, useRef, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import '../../styles/Login.css'
import { useNavigate } from 'react-router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { accessCurrentUser, setCurrentUser } from '../../util/AccessCurrentUser'
import LoadingModal from '../utils/LoadingModal'
import { FaEraser, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa'

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid Email')
    .required('Email required'),
  password: Yup.string()
    .required('Password required')
    .min(8, 'Password should be more than 8 characters')
})

const Login = () => {
  const navigate = useNavigate()
  const passwordRef = useRef(null)
  const [isPassToggled, setIsPassToggled] = useState(false)
  const togglePassRef = useRef(null)
  const [open, setOpen] = useState(false)

  return (
    <div id='loginPage'>
      <LoadingModal open={open} />

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
            enableReinitialize
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              setOpen(true)
              setSubmitting(false)

              fetch('/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
              })
                .then(response => {
                  return response.json()
                })
                .then(result => {
                  if (result.code === 200) {
                    setCurrentUser(result.currentUser)
                    fetch('/allImages', {
                      method: 'post',
                      mode: 'cors',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        profileId: accessCurrentUser()._id
                      })
                    })
                      .then(imageResponse => imageResponse.json())
                      .then(imageResults => {
                        if (imageResults.code === 200) {
                          localStorage.setItem(
                            'entryImages',
                            JSON.stringify(imageResults.allImages)
                          )
                        }

                        window.sessionStorage.setItem('isUserUpdated', true)
                        setOpen(false)
                      })
                      .then(() => {
                        window.location.reload()
                      })
                  } else {
                    setOpen(false)

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
                })

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
                    type='email'
                    className='form-control'
                    id='loginemail'
                    name='email'
                  />
                  {formik.errors.email && formik.touched.email && (
                    <div className='text-danger'>{formik.errors.email}</div>
                  )}
                </div>
                <br />
                <div className='form-group loginFieldWrapper'>
                  <label className='mb-2 ' htmlFor='password'>
                    Password
                  </label>
                  <div className='input-group'>
                    <input
                      ref={passwordRef}
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      type='password'
                      className='form-control'
                      id='loginpassword'
                      name='password'
                    />

                    <button
                      ref={togglePassRef}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      onClick={() => {
                        if (isPassToggled !== true) {
                          setIsPassToggled(true)
                          passwordRef.current.type = 'text'
                          togglePassRef.current.classList.remove(
                            'btn-outline-secondary'
                          )
                          togglePassRef.current.classList.add('btn-secondary')
                        } else {
                          setIsPassToggled(false)
                          passwordRef.current.type = 'password'
                          togglePassRef.current.classList.remove(
                            'btn-secondary'
                          )
                          togglePassRef.current.classList.add(
                            'btn-outline-secondary'
                          )
                        }
                      }}
                      id='toggle-password'
                      type='button'
                      className='btn btn-outline-secondary'
                      aria-label='Show password as plain text. Warning: this will display your password on the screen.'
                    >
                      {isPassToggled && isPassToggled === true ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </div>
                  {formik.errors.password && formik.touched.password && (
                    <div className='text-danger'>{formik.errors.password}</div>
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
