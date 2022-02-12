import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const Logout = ({ value }) => {
  const [loggedOut, setLoggedOut] = useState(false)
  useEffect(() => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('entryImages')
    window.sessionStorage.setItem('isUserUpdated', false)
    value.setCurrentUser(null)

    setLoggedOut(true)
  }, [value])

  return <>{loggedOut && <Navigate to='/login' />}</>
}

export default Logout
