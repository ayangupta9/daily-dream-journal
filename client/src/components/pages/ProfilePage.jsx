import React, { useEffect, useState } from 'react'
import PaginatedItems from '../utils/PaginatedItems'
import DatesHeatmap from '../utils/DatesHeatmap'
import { FaPencilAlt } from 'react-icons/fa'
import '../../styles/ProfilePicture.css'
import '../../styles/ProfilePage.css'
import BioModal from '../utils/BioModal'
import { formattedDateForProfile } from '../../util/FormattedDate'
import ProfilePictureImageSvg from '../utils/ProfilePictureImageSvg'

function getRandomColor () {
  const colorsForEachDay = [
    '#FFA3A3',
    '#FFE382',
    '#7AFFB5',
    '#A9DAFF',
    '#D5B1FF',
    '#D3FF84',
    '#FFBFF9'
  ]

  const day = new Date().getDay()
  return colorsForEachDay[day]
}

const ProfilePage = () => {
  const currentUser = localStorage.getItem('currentUser')
    ? JSON.parse(localStorage.getItem('currentUser'))
    : null

  const [ppColor, setPpColor] = useState(null)

  const name = currentUser.username ? currentUser.username : 'no_name'
  const bio = currentUser.bio ? currentUser.bio : 'no_bio'
  const joinedOn = currentUser.joinedOn ? currentUser.joinedOn : 'no_join_date'

  const [entries, setEntries] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (currentUser) {
      setEntries(currentUser.entries)
    }
    setPpColor(getRandomColor())
  }, [currentUser])

  return (
    <div id='profilePage'>
      <div id='profileContainer'>
        <div id='profileContent'>
          <div id='topContentWrapper'>
            <div id='imageWrapper'>
              {ppColor && (
                <ProfilePictureImageSvg backgroundColor={getRandomColor()} />
              )}
            </div>

            {/* NAME AND BIO */}

            <div id='nameBioWrapper'>
              <h1 className='ps-0'>{name}</h1>
              <div>
                <h4>
                  {bio}
                  <sup>
                    <button
                      onClick={() => {
                        setOpen(true)
                      }}
                      className='btn'
                    >
                      <FaPencilAlt size={14} />
                    </button>
                  </sup>
                </h4>
              </div>
              <h6>
                <b>Joined On:</b> {formattedDateForProfile(joinedOn)}
              </h6>
            </div>

            <BioModal open={open} setOpen={setOpen} user_id={currentUser.id} />
          </div>

          {/* HEATMAP */}

          <DatesHeatmap dates={currentUser.dates} />

          {/* ENTRIES */}

          <h1 className='fw-light'>DREAM ENTRIES</h1>
          <br />

          <div id='entriesWrapper'>
            {entries && entries.length > 0 ? (
              <PaginatedItems items={entries} itemsPerPage={6} />
            ) : (
              <div
                style={{
                  marginBottom: '20px'
                }}
              >
                <i>No entries yet</i>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
