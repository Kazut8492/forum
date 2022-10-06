import React, {useState, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { sendMsg } from "../App";
import { CookieContext, doesHttpOnlyCookieExist } from './CookieContext';
import { WebsocketContext } from './WebsocketContext';


const SignUp = () => {
    const [nickname, setNickname] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("x")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [warningUsernameTaken, setWarningUsernameTaken] = useState("")
    const [warningEmailTaken, setWarningEmailTaken] = useState("")
    const navigate = useNavigate();
    const {cookieExist, setCookieExist} = useContext(CookieContext);

    const {connect, sendMsg} = useContext(WebsocketContext);

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

        localStorage.setItem('username', nickname);

        fetch("http://localhost:8080/new-user", {
            method:"POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(newUser)
        })
        .then(response=>response.json())
        .then((data)=>{
            console.log(data)
            if (data["message"] === "Nickname already taken") {
                setWarningUsernameTaken(data["message"])
                setWarningEmailTaken("")
                localStorage.clear();
                navigate("/signup/")
            } else if (data["message"] === "Email already taken") {
                setWarningUsernameTaken("")
                setWarningEmailTaken(data["message"])
                localStorage.clear();
                navigate("/signup/")
            } else {
                setWarningUsernameTaken("")
                setWarningEmailTaken("")
                navigate("/posts/")
                const body = {type: "0", message: "signup", creator: "SYSTEM", receiver: nickname};
                const jsonBody = JSON.stringify(body);
                sendMsg(jsonBody);
            }
        })
        .catch(error=>console.log(error))
        .finally(()=>{
            event.target.reset()
            setNickname('')
            setAge('')
            setGender('x')
            setFirstName('')
            setLastName('')
            setEmail('')
            setPassword('')
            setCookieExist(doesHttpOnlyCookieExist("cookie"))
        })
    }


    return (
        <>
            <Navbar />
            <main>
                <div className="allposts-container">
                    <div className="post-container">
                        <h1>Sign up form</h1>
                        <form onSubmit={handleSignupSubmit}>
                            <p>Nickname</p>
                            <input type="text" value={nickname} onChange={e=>setNickname(e.target.value)} name="nickname" placeholder="nickname" required />
                            {warningUsernameTaken && <h6>{warningUsernameTaken}</h6>}
                            <p>Age</p>
                            <input type="number" value={age} onChange={e=>setAge(e.target.value)} placeholder="age" required />
                            <p>Gender</p>
                            <select value={gender} onChange={e=>setGender(e.target.value)} name="gender" id="gender-select" required>
                                <option value="x">X</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            <p>First Name</p>
                            <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} name="firstName" placeholder="first name" required />
                            <p>Last Name</p>
                            <input type="text" value={lastName} onChange={e=>setLastName(e.target.value)} name="lastName" placeholder="last name" required />
                            <p>Email</p>
                            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} name="email" placeholder="email" required />
                            {warningEmailTaken && <h6>{warningEmailTaken}</h6>}
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