import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavbarContainer from './components/utils/Navbar'
import FrontPage from './components/utils/FrontPage'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import CreateEntry from './components/pages/CreateEntry'
import ProfilePage from './components/pages/ProfilePage'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'
import Logout from './components/auth/Logout'
import LoggedInFrontPage from './components/utils/LoggedInFrontPage'
import EntryDetailsPage from './components/pages/EntryDetailsPage'
import ErrorPage from './components/pages/ErrorPage'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import SearchPage from './components/pages/SearchPage'

function App () {
  return (
    <div className='App'>
      <BrowserRouter>
        <AuthContext.Consumer>
          {value => {
            return <NavbarContainer value={value} />
          }}
        </AuthContext.Consumer>
        <Routes>
          <Route
            exact
            path='/'
            element={
              <AuthContext.Consumer>
                {value => {
                  console.log(value)

                  return (
                    <>
                      {value.currentUser === null ? (
                        <FrontPage />
                      ) : (
                        <LoggedInFrontPage />
                      )}
                    </>
                  )
                }}
              </AuthContext.Consumer>
            }
          />
          <Route
            exact
            path='login'
            element={
              <AuthContext.Consumer>
                {value => {
                  return <Login value={value} />
                }}
              </AuthContext.Consumer>
            }
          />
          <Route
            exact
            path='logout'
            element={
              <AuthContext.Consumer>
                {value => {
                  return <Logout value={value} />
                }}
              </AuthContext.Consumer>
            }
          />
          <Route exact path='signup' element={<Signup />} />
          <Route
            exact
            path='create'
            element={
              <AuthContext.Consumer>
                {value => {
                  return (
                    <>
                      {value.currentUser !== null ? (
                        <CreateEntry />
                      ) : (
                        <Navigate to='/login' />
                      )}
                    </>
                  )
                }}
              </AuthContext.Consumer>
            }
          />
          <Route
            exact
            path='profile/:username'
            element={
              <AuthContext.Consumer>
                {value => {
                  return (
                    <>
                      {value.currentUser ? (
                        <ProfilePage />
                      ) : (
                        <Navigate to='/login' />
                      )}
                    </>
                  )
                }}
              </AuthContext.Consumer>
            }
          />
          <Route exact path='forgot-password' element={<ForgotPassword />} />
          <Route exact path='entry/:index' element={<EntryDetailsPage />} />
          <Route
            exact
            path='reset-password/:token'
            element={<ResetPassword />}
          />

          <Route
            exact
            path='search'
            element={
              <AuthContext.Consumer>
                {value => {
                  return <SearchPage value={value} />
                }}
              </AuthContext.Consumer>
            }
          />
          <Route path='/*' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
