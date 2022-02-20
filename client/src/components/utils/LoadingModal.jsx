import React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import CircularProgress from '@mui/material/CircularProgress'

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

const LoadingModal = ({ open }) => {
  return (
    <div>
      <Modal
        open={open}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
          }}
        >
          <CircularProgress color='inherit' />
        </Box>
      </Modal>
    </div>
  )
}

export default LoadingModal
