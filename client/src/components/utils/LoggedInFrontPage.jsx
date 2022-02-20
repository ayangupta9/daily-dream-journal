import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/LoggedInFrontPage.css'
import ParticlesBg from 'particles-bg'
import { isUserLoggedIn } from '../../util/AccessCurrentUser'

const LoggedInFrontPage = () => {
  return (
    <div id='loggedInFrontPage'>
      <ParticlesBg
        type='cobweb'
        bg={{
          position: 'absolute',
          zIndex: '-1',
          top: '0',
          left: '0',
          width: '100%'
        }}
      />

      <div id='loggedInFrontPageContent'>
        <h1 id='loggedInFrontPageMainHeader'>DAILY DREAM JOURNAL</h1>

        <h3 id='frontPageSubHeader'>
          NOW THAT YOU'RE AWAKE, LET'S WRITE DOWN ABOUT THAT DREAM !!
        </h3>

        <div id='createEntryButtonWrapper'>
          <Link
            to='/create'
            className='btn btn-outline-warning frontpageCreateEntryButton'
          >
            CREATE 📝
          </Link>

          <Link
            to='/logout'
            className='btn btn-outline-danger frontpageLogoutButton'
          >
            LOGOUT 😴
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoggedInFrontPage
