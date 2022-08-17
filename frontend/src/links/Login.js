import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { CookieContext, doesHttpOnlyCookieExist } from './CookieContext';

const Login = () => {
    const [loginName, setLoginName] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const {cookieExist, setCookieExist} = useContext(CookieContext);
    const navigate = useNavigate()

    const handleLoginSubmit = (event) => {
        event.preventDefault();

        const loginUser = {
            Username: loginName,
            Email: loginName,
            Password: loginPassword,
        }

        fetch("http://localhost:8080/login", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(loginUser)
        })
        .then(response=>response.json())
        .then((data)=>{
            console.log(data)
            event.target.reset()
            setLoginName('')
            setLoginPassword('')
            setCookieExist(doesHttpOnlyCookieExist("cookie"))
            navigate("/posts/")
        })
        .catch(error=>console.log(error))
    }

    return (
        <>
            <Navbar />
            <main>
                <div className='allposts-container'>
                    <div className='post-container'>
                        <h1>Log in form</h1>
                        <form onSubmit={handleLoginSubmit}>
                            <p>Nickname / Email</p>
                            <input type="text" value={loginName} onChange={e=>setLoginName(e.target.value)} placeholder="nickname / email" required />
                            <p>Password</p>
                            <input type="password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} placeholder="password" required />
                            <hr style={{visibility: "hidden"}} />
                            <button>Log in</button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Login;