import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/ErrorPage.css'
const ErrorPage = () => {
  return (
    <div id='errorPage'>
      <h1 id='errorPageHeader'>ERROR</h1>
      <h2 id='errorPageSubheader'>Hmmm. Seems like you're not awake yet 😴</h2>
      <br />
      <br />
      <Link className='btn btn-outline-dark' to={'/'}>
        Home Page
      </Link>
    </div>
  )
}

export default ErrorPage
