import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { setCurrentUser } from '../../util/AccessCurrentUser'

const Logout = ({ isLoggedIn, setIsLoggedIn }) => {
  useEffect(() => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('entryImages')
    window.sessionStorage.setItem('isUserUpdated', false)
    setIsLoggedIn(false)
  }, [])

  return <>{isLoggedIn && <Navigate to='/login' />}</>
}

export default Logout
