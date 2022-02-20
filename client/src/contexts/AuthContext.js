import React, { useEffect, useState } from 'react'

export const AuthContext = React.createContext({})

export default function AuthProvider ({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  function checkLocalStorage () {
    return (
      localStorage.getItem('currentUser') === undefined ||
      localStorage.getItem('currentUser') === 'undefined' ||
      localStorage.getItem('currentUser') === null
    )
  }

  async function setNewData (setByLogin = false, result = null) {
    if (setByLogin) {
      setCurrentUser(result.currentUser)
      return
    }

    if (!checkLocalStorage()) {
      const currUser = JSON.parse(localStorage.getItem('currentUser'))
      if (
        window.sessionStorage.getItem('isUserUpdated') !== true ||
        window.sessionStorage.getItem('isUserUpdated') !== 'true'
      ) {
        const response = await fetch('/getUser', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: currUser._id })
        })

        const result = await response.json()
        localStorage.setItem('currentUser', JSON.stringify(result.currentUser))
        setCurrentUser(result.currentUser)

        const imageResponse = await fetch('/allImages', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ profileId: currUser._id })
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
  }

  useEffect(() => {
    setNewData()
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, setNewData }}>
      {children}
    </AuthContext.Provider>
  )
}
