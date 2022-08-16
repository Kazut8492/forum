import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CookieContext, doesHttpOnlyCookieExist } from './CookieContext';

const Navbar = () => {
    const {cookieExist, setCookieExist} = useContext(CookieContext)

    const handleLogoutClick = () => {
        fetch("http://localhost:8080/logout", {
            method:"GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type":"application/json",
            }
        })
        .then(response=>response.json())
        .then(data=>{
            console.log(data)
            // setCookieExist(false)
            setCookieExist(doesHttpOnlyCookieExist("cookie"))
        })
        .catch(error=>console.log(error))
    }

    return (
        <>
            <nav className="nav-container">
                <ul className="nav-list">
                    <li><Link to={`/posts/`}>Forum</Link></li>
                    {!cookieExist && <li><Link to={`/signup/`}>Sign up</Link></li>}
                    {!cookieExist && <li><Link to={`/login/`}>Login</Link></li>}
                    {cookieExist && <li><Link to={'/posts/'} onClick={handleLogoutClick}>Logout</Link></li>}
                </ul>
            </nav>
        </>
    )
}

export default Navbar;