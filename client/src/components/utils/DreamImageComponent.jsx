import React, { useEffect, useState } from 'react'
import ImageModal from './ImageModal'

const DreamImageComponent = ({ profile_id, entry_id }) => {
  const [entryImage, setEntryImage] = useState({
    isImagePresent: false,
    imageBase64: null
  })

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)

  useEffect(() => {
    let drawingEntries = localStorage.getItem('entryImages')
    if (drawingEntries !== null && drawingEntries !== 'undefined') {
      drawingEntries = JSON.parse(localStorage.getItem('entryImages'))
      if (drawingEntries.hasOwnProperty(entry_id)) {
        const splittedString = drawingEntries[entry_id].split(
          'data:image/png;base64,'
        )
        setEntryImage({
          isImagePresent: true,
          imageBase64:
            'data:image/png;base64,' + splittedString[splittedString.length - 1]
        })
      }
    }
  }, [entry_id])

  return (
    <div id='drawnImageWrapper'>
      {entryImage.isImagePresent === true ? (
        <>
          <h5 id='drawnImageHeader'>Here's what you drew</h5>
          <div id='drawnImageContainer'>
            <img
              onClick={() => {
                handleOpen()
              }}
              className='drawnImage'
              src={entryImage.imageBase64}
              alt='Entry related'
            />
          </div>

          <ImageModal
            open={open}
            setOpen={setOpen}
            image={entryImage.imageBase64}
          />
        </>
      ) : null}
    </div>
  )
}

export default DreamImageComponent
