import { Formik } from 'formik'
import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../../styles/ForgotPassword.css'
import * as Yup from 'yup'

const ForgotPassSchema = Yup.object().shape({
  forgotpassemail: Yup.string()
    .email()
    .required('This field is required')
})

const ForgotPassword = () => {
  return (
    <div id='forgotPassPage'>
      <div id='forgotPassContainer'>
        <h1>FORGOT PASSWORD</h1>
        <br />
        <div id='forgotPassContent'>
          <Formik
            initialValues={{ forgotpassemail: '' }}
            validationSchema={ForgotPassSchema}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              const response = await fetch('/forgot', {
                method: 'POST',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
              })

              const result = await response.json()

              if (result.code === 200) {
                toast.success(result.message, {
                  position: 'bottom-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined
                })
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
              <form onSubmit={formik.handleSubmit} id='forgotPassForm'>
                <div className='form-group emailFieldWrapper'>
                  <label className='mb-2' htmlFor='forgotpassemail'>
                    Email address for password reset
                  </label>
                  <input
                    onChange={formik.handleChange}
                    type={'email'}
                    id='forgotpassemail'
                    className='form-control'
                    name='forgotpassemail'
                    value={formik.values.forgotpassemail}
                  />
                  {formik.errors.forgotpassemail &&
                    formik.touched.forgotpassemail && (
                      <div className='text-danger'>
                        {formik.errors.forgotpassemail}
                      </div>
                    )}
                </div>
                <button
                  id='forgotPassSubmit'
                  disabled={formik.isSubmitting}
                  className='btn btn-outline-primary'
                  type='submit'
                >
                  SEND RESET EMAIL
                </button>
              </form>
            )}
          </Formik>

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
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
