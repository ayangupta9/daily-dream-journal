import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/FrontPage.css'
import ParticlesBg from 'particles-bg'
const FrontPage = () => {
  return (
    <div id='frontPage'>
      <ParticlesBg
        type='cobweb'
        bg={{
          position: 'absolute',
          zIndex: '-999',
          top: '0',
          left: '0',
          width: '100%'
        }}
      />
      
      <div id='frontPageContent'>
        <h1 id='frontPageMainHeader'>DAILY DREAM JOURNAL</h1>
        <h3 id='loginfrontPageSubHeader'>GIVE YOUR DREAM WORDS</h3>
        <div id='userAuthButtonsWrapper'>
          <Link
            to={'/login'}
            className='btn btn-outline-primary frontpageAuthButton'
          >
            LOGIN
          </Link>

          <Link
            to={'/signup'}
            className='btn btn-outline-danger frontpageAuthButton'
          >
            REGISTER
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FrontPage
