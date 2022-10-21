import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { CookieContext, doesHttpOnlyCookieExist } from './CookieContext';
import { sendMsg } from "./Index";


const Login = () => {
    const [loginName, setLoginName] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [warningUsername, setWarningUsername] = useState("")
    const [warningPassword, setWarningPassword] = useState("")
    const {cookieExist, setCookieExist} = useContext(CookieContext);
    const navigate = useNavigate()

    const handleLoginSubmit = (event) => {
        event.preventDefault();

        const loginUser = {
            Username: loginName,
            Email: loginName,
            Password: loginPassword,
        }

        localStorage.setItem('username', loginName);

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
            
            if (data["message"] === "Wrong username / email") {
                setWarningUsername(data["message"])
                setWarningPassword("")
                navigate("/login/")
                localStorage.clear();
            } else if (data["message"] === "Wrong password") {
                setWarningUsername("")
                setWarningPassword(data["message"])
                navigate("/login/")
                localStorage.clear();
            } else {
                setWarningUsername("")
                setWarningPassword("")
                navigate("/posts/")
                const body = {type: "0", message: "login", creator: "SYSTEM", receiver: loginName};
                const jsonBody = JSON.stringify(body);
                sendMsg(jsonBody);
            }
        })
        .catch(error=>console.log(error))
        .finally(()=>{
            event.target.reset()
            setLoginName('')
            setLoginPassword('')
            setCookieExist(doesHttpOnlyCookieExist("cookie"))
        })
    }

    const handleSignupSubmit = (event) => {
        event.preventDefault();
        navigate("/signup/")
    }

    if (cookieExist) {
        navigate("/posts/")
    } else {
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
                                {warningUsername && <h6>{warningUsername}</h6>}
                                <p>Password</p>
                                <input type="password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} placeholder="password" required />
                                {warningPassword && <h6>{warningPassword}</h6>}
                                <hr style={{visibility: "hidden"}} />
                                <button>Log in</button>
                            </form>
                            {/* <form onSubmit={handleSignupSubmit}>
                                <button>Sign up</button>
                            </form> */}
                        </div>
                    </div>
                </main>
            </>
        )
    }

}

export default Login;