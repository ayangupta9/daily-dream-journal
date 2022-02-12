import React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { Formik } from 'formik'
import { toast } from 'react-toastify'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  padding: '2em',
  borderRadius: '10px',
  display: 'flex',
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'stretch',
  flexDirection: 'column'
}

const BioModal = ({ open, setOpen, user_id }) => {
  const handleClose = () => setOpen(false)

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <h2 className='font-monospace mb-4 fw-bold' id='modal-modal-title'>
            Enter a new bio
          </h2>
          <div id='modal-modal-description'>
            <Formik
              initialValues={{ changedBio: '' }}
              onSubmit={async (values, { resetForm, setSubmitting }) => {
                if (values.changedBio.length === 0) {
                  handleClose()
                  return
                }

                const response = await fetch('/changeBio', {
                  method: 'POST',
                  mode: 'cors',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    id: user_id,
                    newBio: values.changedBio
                  })
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
                  window.sessionStorage.setItem('isUserUpdated', false)
                  window.location.reload()
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
                handleClose()
                setSubmitting(false)
                resetForm()
              }}
            >
              {formik => {
                return (
                  <form onSubmit={formik.handleSubmit}>
                    <input
                      name='changedBio'
                      value={formik.values.changedBio}
                      onChange={formik.handleChange}
                      type='text'
                      className='form-control mb-4'
                    />
                    <button
                      disabled={formik.isSubmitting}
                      type='submit'
                      className='btn btn-outline-dark'
                    >
                      CHANGE BIO
                    </button>
                  </form>
                )
              }}
            </Formik>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default BioModal
