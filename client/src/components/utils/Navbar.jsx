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
import { accessCurrentUser } from '../../util/AccessCurrentUser'

const NavbarContainer = ({ isLoggedIn }) => {
  const [links, setLinks] = useState([])
  useEffect(() => {

    if (isLoggedIn) {
      setLinks([
        { name: 'CREATE', symbol: '📝', link: '/create' },
        { name: 'SEARCH', symbol: '🔍', link: '/search' },
        {
          name: 'PROFILE',
          symbol: '👤',
          link: `/profile/${accessCurrentUser().username}`
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
  }, [isLoggedIn])

  const [open, setOpen] = useState(false)


  return (
    <div>
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
      {/* )} */}
    </div>
  )
}

export default NavbarContainer
