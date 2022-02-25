import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavbarContainer from './components/utils/Navbar'
import FrontPage from './components/utils/FrontPage'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import CreateEntry from './components/pages/CreateEntry'
import ProfilePage from './components/pages/ProfilePage'
import { Navigate } from 'react-router-dom'
import Logout from './components/auth/Logout'
import LoggedInFrontPage from './components/utils/LoggedInFrontPage'
import EntryDetailsPage from './components/pages/EntryDetailsPage'
import ErrorPage from './components/pages/ErrorPage'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import SearchPage from './components/pages/SearchPage'
import {
  accessCurrentUser,
  isUserLoggedIn,
  setCurrentUser
} from './util/AccessCurrentUser'
import { useEffect, useState } from 'react'

function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn())

  useEffect(() => {
    async function setNewData () {
      if (isUserLoggedIn()) {
        const isUserUpdated = window.sessionStorage.getItem('isUserUpdated')
        const currUser = accessCurrentUser()
        if (isUserUpdated !== true && isUserUpdated !== 'true') {
          const response = await fetch('/getUser', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: currUser._id })
          })

          const result = await response.json()
          localStorage.setItem(
            'currentUser',
            JSON.stringify(result.currentUser)
          )
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

    setNewData()
  }, [])

  return (
    <div className='App'>
      <BrowserRouter>
        <NavbarContainer isLoggedIn={isLoggedIn} />
        <Routes>
          <Route
            exact
            path='/'
            element={<>{isLoggedIn ? <LoggedInFrontPage /> : <FrontPage />}</>}
          />
          <Route
            exact
            path='login'
            element={<>{isLoggedIn ? <Navigate to='/' /> : <Login />}</>}
          />

          <Route
            exact
            path='signup'
            element={<>{isLoggedIn ? <Navigate to='/' /> : <Signup />}</>}
          />
          <Route
            exact
            path='logout'
            element={
              <>
                {isLoggedIn ? (
                  <Logout
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                  />
                ) : (
                  <Navigate to='/' />
                )}
              </>
            }
          />

          <Route
            exact
            path='create'
            element={
              <>{isLoggedIn ? <CreateEntry /> : <Navigate to='/login' />}</>
            }
          />
          <Route
            exact
            path='profile/:username'
            element={<>{isLoggedIn ? <ProfilePage /> : <Navigate to='/' />}</>}
          />
          <Route
            exact
            path='forgot-password'
            element={
              <>{!isLoggedIn ? <ForgotPassword /> : <Navigate to='/' />}</>
            }
          />
          <Route
            exact
            path='entry/:index'
            element={
              <>
                {isLoggedIn ? <EntryDetailsPage /> : <Navigate to='/login' />}
              </>
            }
          />
          <Route
            exact
            path='reset-password/:token'
            element={
              <>{!isLoggedIn ? <ResetPassword /> : <Navigate to='/' />}</>
            }
          />

          <Route
            exact
            path='search'
            element={<>{isLoggedIn && <SearchPage />}</>}
          />
          <Route path='/*' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
