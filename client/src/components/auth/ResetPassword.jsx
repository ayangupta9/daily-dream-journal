import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import * as Yup from 'yup'
import '../../styles/ResetPassword.css'

const validationSchema = Yup.object().shape({
  resetPasswordField: Yup.string()
    .required('This is a required field')
    .min(8, 'Password should be longer than 8 characters'),
  confirmPassword: Yup.string().test(
    'passwords-match',
    'Passwords must match',
    function (value) {
      return this.parent.resetPasswordField === value
    }
  )
})

const ResetPassword = () => {
  const [displayOrNot, setDisplayOrNot] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    async function showResetPassword () {
      const token = location.pathname.split('/')[2]

      if (token.length === 0) {
        setDisplayOrNot(false)
        return
      }

      const response = await fetch(`/reset/${token}`)
      const result = await response.json()

      if (result.code === 200 && result.display === true) {
        setDisplayOrNot(true)
      } else {
        setDisplayOrNot(false)
      }
    }

    showResetPassword()
  }, [location.pathname])

  return (
    <div id='resetPassPage'>
      {displayOrNot === true ? (
        <div id='resetPasswordContainer'>
          <h1>FORGOT PASSWORD</h1>
          <br />
          <div id='resetPasswordContent'>
            <Formik
              initialValues={{ resetPasswordField: '', confirmPassword: '' }}
              validationSchema={validationSchema}
              onSubmit={async (values, { resetForm, setSubmitting }) => {
                await fetch(`/reset/${location.pathname.split('/')[2]}`, {
                  method: 'POST',
                  mode: 'cors',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    newPassword: values.resetPasswordField
                  })
                })

                setSubmitting(false)
                resetForm()
                navigate('/login')
              }}
            >
              {formik => (
                <form onSubmit={formik.handleSubmit} id='resetPasswordForm'>
                  <div className='form-group passwordFieldWrapper'>
                    <label className='mb-2' htmlFor='resetPasswordField'>
                      New password
                    </label>
                    <input
                      onChange={formik.handleChange}
                      type={'password'}
                      id='resetPasswordField'
                      className='form-control mb-4'
                      name='resetPasswordField'
                      value={formik.values.resetPasswordField}
                    />

                    {formik.errors.resetPasswordField &&
                      formik.touched.resetPasswordField && (
                        <div className='text-danger'>
                          {formik.errors.resetPasswordField}
                        </div>
                      )}
                  </div>

                  <div className='form-group confirmPasswordFieldWrapper'>
                    <label className='mb-2' htmlFor='confirmPassword'>
                      Confirm password
                    </label>
                    <input
                      onChange={formik.handleChange}
                      type={'password'}
                      id='confirmPassword'
                      className='form-control mb-4'
                      name='confirmPassword'
                      value={formik.values.confirmPassword}
                    />

                    {formik.errors.confirmPassword &&
                      formik.touched.confirmPassword && (
                        <div className='text-danger'>
                          {formik.errors.confirmPassword}
                        </div>
                      )}
                  </div>
                  <button
                    id='resetPasswordSubmit'
                    disabled={formik.isSubmitting}
                    className='btn btn-outline-primary'
                    type='submit'
                  >
                    RESET PASSWORD
                  </button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      ) : (
        <h1 className='mt-6 p-6'>Could not verify User</h1>
      )}
    </div>
  )
}

export default ResetPassword
