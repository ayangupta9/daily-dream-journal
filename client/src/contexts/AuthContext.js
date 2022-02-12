import React, { useEffect, useState } from 'react'

export const AuthContext = React.createContext({})

export default function AuthProvider ({ children }) {
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem('currentUser') !== 'undefined'
      ? JSON.parse(localStorage.getItem('currentUser'))
      : null
  )

  function checkLocalStorage () {
    return (
      localStorage.getItem('currentUser') !== 'undefined' &&
      localStorage.getItem('currentUser') !== null
    )
  }

  function checkSessionStorage () {
    return (
      window.sessionStorage.getItem('isUserUpdated') === null ||
      window.sessionStorage.getItem('isUserUpdated') === 'false' ||
      window.sessionStorage.getItem('isUserUpdated') === false
    )
  }

  useEffect(() => {
    async function setNewData () {
      if (checkSessionStorage() && checkLocalStorage()) {
        const response = await fetch('/getUser', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: currentUser._id })
        })

        const result = await response.json()
        localStorage.setItem('currentUser', JSON.stringify(result.currentUser))
        setCurrentUser(JSON.stringify(result.currentUser))
        const imageResponse = await fetch('/allImages', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ profileId: currentUser._id })
        })

        const imageResults = await imageResponse.json()

        if (imageResults.code === 200) {
          localStorage.setItem(
            'entryImages',
            JSON.stringify(imageResults.allImages)
          )
        }
        window.sessionStorage.setItem('isUserUpdated', true)
      }
    }

    setNewData()
  }, [currentUser])

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}
