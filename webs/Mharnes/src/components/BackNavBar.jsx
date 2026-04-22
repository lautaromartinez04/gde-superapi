import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/images/Logotipo-04.png'
import "../assets/css/Backnavbar.css"

export const BackNavBar = () => {
  return (
    <>
            <div className="underbarra"></div>
            <nav className="navbar navbar-expand-lg navbar-dark undernav">
                <Link className="navbar-brand" to="/">
                    <img className='logo' src={logo} alt="" />
                </Link>
            </nav>
        </>
  )
}
