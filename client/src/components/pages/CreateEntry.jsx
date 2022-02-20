import { Formik } from 'formik'
import React, { useRef, useState } from 'react'
import { TagsInput } from '../utils/TagsInput'
import '../../styles/CreateEntry.css'
import * as Yup from 'yup'
import DreamTypeCheckboxes from '../utils/DreamTypeCheckboxes'
import DrawingCanvas from '../utils/DrawingCanvas'

import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { accessCurrentUser, setCurrentUser } from '../../util/AccessCurrentUser'

const DreamEntrySchema = Yup.object().shape({
  entrytitle: Yup.string()
    .required('Title required')
    .max(50, 'Title too big'),
  entry_mood_at_bedtime: Yup.string()
    .notRequired()
    .max(20),
  entrycontent: Yup.string().max(3000),
  entry_postscript: Yup.string()
    .notRequired()
    .max(500)
})

const CreateEntry = () => {
  const currentUser = JSON.parse(accessCurrentUser())

  const [characterTags, setCharacterTags] = useState([])
  const [locationTags, setLocationTags] = useState([])
  const [emotionTags, setEmotionTags] = useState([])
  const [dreamType, setDreamType] = useState({
    nightmare: false,
    fantasy: false,
    symbolic: false,
    lucid: false,
    bizarre: false,
    recurring: false
  })

  const navigate = useNavigate()
  const canvasRef = useRef(null)

  return (
    <div id='createEntryPage'>
      <h1 className='mb-4 fw-light'>CREATE A NEW ENTRY 📝</h1>
      <div id='createEntryContainer'>
        <Formik
          validationSchema={DreamEntrySchema}
          initialValues={{
            entrytitle: '',
            entry_time_went_to_bed: '',
            entry_mood_at_bedtime: '',
            entrycontent: '',
            entry_postscript: ''
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const result = {
              ...values,
              dreamType: JSON.stringify(dreamType),
              characters: characterTags,
              locations: locationTags,
              emotions: emotionTags,
              timestamp: new Date().getTime().toString(),
              profileId: currentUser._id,
              profileUsername: currentUser.username
            }

            let finalResult = {}
            const resultentries = Object.entries(result)
            for (let i of resultentries) {
              if (i[1].length > 0 || i[1].constructor.name === 'Object') {
                finalResult[i[0]] = i[1]
              }
            }

            const entryFormData = new FormData()
            for (const [key, value] of Object.entries(finalResult)) {
              entryFormData.append(key, value)
            }

            const exportData = await canvasRef.current.exportImage('png')
            const imageBlob = await (await fetch(exportData)).blob()

            const imageArrayBuffer = await imageBlob.arrayBuffer()

            if (imageArrayBuffer.byteLength > 5776) {
              entryFormData.append('upload', imageBlob)
            }

            const res = await axios.post('/createentry', entryFormData)

            resetForm()
            canvasRef.current.resetCanvas()
            setDreamType([])
            setCharacterTags([])
            setLocationTags([])
            setEmotionTags([])

            const serverresult = res.data

            if ('newCurrentUser' in serverresult) {
              const newCurrentUser = serverresult.newCurrentUser
              setCurrentUser(newCurrentUser)

              if (imageArrayBuffer.byteLength > 5776) {
                if (
                  localStorage.getItem('entryImages') &&
                  localStorage.getItem('entryImages') !== null
                ) {
                  let entryImages = JSON.parse(
                    localStorage.getItem('entryImages')
                  )
                  entryImages[serverresult.entryId] = exportData

                  localStorage.setItem(
                    'entryImages',
                    JSON.stringify(entryImages)
                  )
                } else {
                  let entryImages = {}
                  entryImages[serverresult.entryId] = exportData

                  localStorage.setItem(
                    'entryImages',
                    JSON.stringify(entryImages)
                  )
                }
              }

              setSubmitting(false)

              navigate(`/profile/${newCurrentUser.username}`)
            } else {
            }
          }}
        >
          {formik => {
            return (
              <form id='entryForm' onSubmit={formik.handleSubmit}>
                {/* TITLE */}
                <div className='form-group entryInputFieldWrapper'>
                  <label htmlFor='entrytitle' className='form-label'>
                    Title
                  </label>
                  <input
                    style={{
                      fontWeight: '900',
                      maxLength: '50'
                    }}
                    className='form-control'
                    type='text'
                    name='entrytitle'
                    id='entrytitle'
                    value={formik.values.entrytitle}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.entrytitle && formik.touched.entrytitle ? (
                    <div className='text-danger'>
                      {formik.errors.entrytitle}
                    </div>
                  ) : null}
                </div>
                <br />

                <div className='trivialInfoContainer'>
                  <div className='container1'>
                    {/* TIME */}

                    <div className='form-group timeFieldWrapper'>
                      <label
                        htmlFor='entry_time_went_to_bed'
                        className='form-label'
                      >
                        Time went to bed
                      </label>
                      <input
                        style={{
                          fontWeight: '900'
                        }}
                        className='form-control'
                        type='time'
                        name='entry_time_went_to_bed'
                        id='entry_time_went_to_bed'
                        value={formik.values.entry_time_went_to_bed}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.entry_time_went_to_bed &&
                      formik.touched.entry_time_went_to_bed ? (
                        <div className='text-danger'>
                          {formik.errors.entry_time_went_to_bed}
                        </div>
                      ) : null}
                    </div>
                    <br />

                    {/* MOOD */}

                    <div className='form-group moodFieldWrapper'>
                      <label
                        htmlFor='entry_mood_at_bedtime'
                        className='form-label'
                      >
                        Mood at bedtime
                      </label>
                      <input
                        style={{
                          fontWeight: '900',
                          maxLength: '20'
                        }}
                        className='form-control'
                        type='text'
                        name='entry_mood_at_bedtime'
                        id='entry_mood_at_bedtime'
                        value={formik.values.entry_mood_at_bedtime}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.entry_mood_at_bedtime &&
                      formik.touched.entry_mood_at_bedtime ? (
                        <div className='text-danger'>
                          {formik.errors.entry_mood_at_bedtime}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <br />

                  <div className='container2'>
                    {/* <label htmlFor="dreamTypeWrapper"></label> */}
                    <DreamTypeCheckboxes
                      dreamType={dreamType}
                      setDreamType={setDreamType}
                    />

                    {/* CHARACTERS */}

                    <div className='form-group tagsInputWrapper'>
                      <label htmlFor='entry_characters' className='form-label'>
                        Characters
                      </label>

                      <TagsInput
                        tags={characterTags}
                        tagTitle={'characters'}
                        setTags={setCharacterTags}
                      />
                    </div>

                    {/* LOCATIONS */}
                    <div className='form-group tagsInputWrapper'>
                      <label htmlFor='entry_locations' className='form-label'>
                        Locations
                      </label>
                      <TagsInput
                        tagTitle={'locations'}
                        tags={locationTags}
                        setTags={setLocationTags}
                      />
                    </div>

                    {/* EMOTIONS */}
                    <div className='form-group tagsInputWrapper'>
                      <label htmlFor='entry_emotions' className='form-label'>
                        Emotions
                      </label>
                      <TagsInput
                        tagTitle={'emotions'}
                        tags={emotionTags}
                        setTags={setEmotionTags}
                      />
                    </div>
                  </div>
                </div>
                <br />

                {/* CONTENT */}

                <div className='form-group dreamContentWrapper'>
                  <label htmlFor='entrycontent' className='form-label'>
                    Content
                  </label>
                  <textarea
                    maxLength={5000}
                    className='form-control'
                    name='entrycontent'
                    id='entrycontent'
                    rows='10'
                    value={formik.values.entrycontent}
                    onChange={formik.handleChange}
                    style={{
                      resize: 'none'
                    }}
                  ></textarea>
                  {formik.errors.entrycontent && formik.touched.entrycontent ? (
                    <div className='text-danger'>
                      {formik.errors.entrycontent}
                    </div>
                  ) : null}
                </div>

                <DrawingCanvas canvasRef={canvasRef} />

                {/* POSTSCRIPT */}
                <br />
                <div className='form-group dreamPostscriptContentWrapper'>
                  <label htmlFor='entry_postscript' className='form-label'>
                    PostScript <sub>(Dream meaning or extra info)</sub>
                  </label>
                  <textarea
                    maxLength={1000}
                    className='form-control'
                    name='entry_postscript'
                    id='entry_postscript'
                    rows='5'
                    value={formik.values.entry_postscript}
                    onChange={formik.handleChange}
                    style={{
                      resize: 'none'
                    }}
                  ></textarea>
                  {formik.errors.entry_postscript &&
                  formik.touched.entry_postscript ? (
                    <div className='text-danger'>
                      {formik.errors.entry_postscript}
                    </div>
                  ) : null}
                </div>

                {/* SUBMIT */}
                <br />
                <div className='form-group'>
                  <button
                    disabled={formik.isSubmitting}
                    className='w-100 btn btn-outline-dark'
                    id='submitEntryButton'
                    type='submit'
                  >
                    CREATE ENTRY
                  </button>
                </div>
              </form>
            )
          }}
        </Formik>
        {/* </div> */}
      </div>
    </div>
  )
}

export default CreateEntry
