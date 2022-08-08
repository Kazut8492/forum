import React, {useState} from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignupSubmit = (event) => {
        event.preventDefault();

        const newUser = {
            Username: username,
            Email: email,
            Password: password,
        }

        fetch("http://localhost:8080/new-user", {
            method:"POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(newUser)
        })
        .then(response=>response.json())
        .then(data=>{
            // console.log(data)
            // Comments are nested inside the posts object.
            // setPosts(data)
            event.target.reset()
            setUsername('')
            setEmail('')
            setPassword('')
        })
        .catch(error=>console.log(error))
    }


    return (
        <>
            <nav className="nav-container">
                <ul className="nav-list">
                    <li>
                        <Link to={`/`}>Forum</Link>
                    </li>
                    <li>
                        <Link to={`/signup/`}>Sign up</Link>
                    </li>
                    <li>
                        <Link to={`/login/`}>Login</Link>
                    </li>
                </ul>
            </nav>
            <main>
                <div className="allposts-container">
                    <div className="post-container">
                        <h1>Sign up form</h1>
                        <form onSubmit={handleSignupSubmit}>
                            <p>Username</p>
                            <input type="text" value={username} onChange={e=>setUsername(e.target.value)} name="username" placeholder="username" required />
                            <p>Email</p>
                            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} name="email" placeholder="email" required />
                            <p>Password</p>
                            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} name="password" placeholder="password" required />
                            <hr style={{visibility: "hidden"}} />
                            <button>Submit to signup</button>
                        </form>
                    </div>
                </div>   
            </main>
        </>
    )
}

export default SignUp;