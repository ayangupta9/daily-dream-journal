import React, { useEffect, useState } from 'react'
import {
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  NavbarToggler,
  Collapse
} from 'reactstrap'
import '../../styles/NavbarContainer.css'

const NavbarContainer = () => {
  const [currentUser, setCurrentUser] = useState(null)

  const [links, setLinks] = useState([])

  useEffect(() => {
    const stringifiedCurrentUser = localStorage.getItem('currentUser')

    const user =
      stringifiedCurrentUser !== 'undefined'
        ? JSON.parse(stringifiedCurrentUser)
        : null

    setCurrentUser(user)
  }, [])

  useEffect(() => {
    if (currentUser) {
      setLinks([
        { name: 'CREATE', symbol: '📝', link: '/create' },
        { name: 'SEARCH', symbol: '🔍', link: '/search' },
        {
          name: 'PROFILE',
          symbol: '👤',
          link: `/profile/${currentUser.username}`
        },
        {
          name: 'LOGOUT',
          symbol: '😴',
          link: '/logout'
        }
      ])
    } else {
      setLinks([
        {
          name: 'LOGIN',
          symbol: '⏰',
          link: '/login'
        },
        { name: 'SIGNUP', symbol: '🆕', link: '/signup' }
      ])
    }
  }, [currentUser])

  const [open, setOpen] = useState(false)

  return (
    <div>
      {links.length > 0 && (
        <Navbar
          className='fixed-top navbar-style'
          color='light'
          light
          expand='sm'
        >
          <NavbarBrand href='/'>⛅</NavbarBrand>

          <NavbarToggler
            onClick={() => {
              setOpen(!open)
            }}
          />

          <Collapse isOpen={open} navbar>
            <Nav className='ms-auto' navbar>
              {links.map((link, index) => {
                return (
                  <NavLink key={index} href={link.link}>
                    {link.name}
                  </NavLink>
                )
              })}
            </Nav>
          </Collapse>
        </Navbar>
      )}
    </div>
  )
}

export default NavbarContainer
