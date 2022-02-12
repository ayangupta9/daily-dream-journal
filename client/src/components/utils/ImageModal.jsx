import React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

const style = {
  padding: '1em',
  width: '70%',
  height: '70%',
  display: 'flex',
  textAlign: 'center',
  justifyContent: 'start',
  border: 'none',
  alignItems: 'flex-start',
  flexDirection: 'column',
  outlineStyle: 'none'
}

const ImageModal = ({ open, setOpen, image }) => {
  const handleClose = () => setOpen(false)

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        style={{
          overflowY: 'scroll',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <div>
            <img
              className='drawnImageShowcase'
              src={image}
              alt="Here's what you drew"
            />
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default ImageModal
