import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
    const [nickname, setNickname] = useState("")
    const [age, setAge] = useState()
    const [gender, setGender] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const handleSignupSubmit = (event) => {
        event.preventDefault();

        const newUser = {
            Username: nickname,
            Email: email,
            Password: password,
            Age: age,
            Gender: gender,
            FirstName: firstName,
            LastName: lastName,
        }

        fetch("http://localhost:8080/new-user", {
            method:"POST",
            // mode: "cors",
            // cache: "no-cache",
            // credentials: "same-origin",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(newUser)
        })
        .then(response=>response.json())
        .then(data=>{
            event.target.reset()
            setNickname('')
            setEmail('')
            setPassword('')
        })
        .catch(error=>console.log(error))

        navigate("/")
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
                            <p>Nickname</p>
                            <input type="text" value={nickname} onChange={e=>setNickname(e.target.value)} name="nickname" placeholder="nickname" required />
                            <p>Age</p>
                            <input type="number" value={age} onChange={e=>setAge(e.target.value)} placeholder="age" required />
                            <p>Gender</p>
                            <select value={gender} onChange={e=>setGender(e.target.value)} name="gender" id="gender-select" required>
                                <option value="other" select="selected">Other</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            <p>First Name</p>
                            <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} name="firstName" placeholder="first name" required />
                            <p>Last Name</p>
                            <input type="text" value={lastName} onChange={e=>setLastName(e.target.value)} name="lastName" placeholder="last name" required />
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