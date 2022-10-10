import React, {useEffect, useState, useContext} from 'react';
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";
import {OnlineUsersContext} from "./OnlineUsersContext";
import { CookieContext } from './CookieContext';

const Chat = () => {
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const navigate = useNavigate();
    const {onlineUsers, sortedUsers, chatHistory, allUsersData, setChatHistory} = useContext(OnlineUsersContext);
    const {cookieExist} = useContext(CookieContext);

    useEffect(()=>{
        fetch("http://localhost:8080/chatHistory", {
            method:"GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type":"application/json",
            },
            redirect:"manual",
            referrer:"no-referrer"
        })
        .then(response=>response.json())
        .then(data=>{
            let result = data ? data: [];
            console.log({messages: result})
            setChatHistory({messages: result})
        })
        .catch(error=>console.log(error))
    },[]);

    const handleCardClick = (sortedUsers) => {
        navigate(`/chatroom/${sortedUsers}`, {state:{chatHistory}})
        // need to reload. Otherwise, old username shown up on creatorUsername of the messages
        // window.location.reload();
    }

    if (!cookieExist) {
        navigate("/posts");
        return
    } else {
        return(<>
            <Navbar />
            {sortedUsers && sortedUsers.map(user => {
                if (user !== username) {
                    return (
                        <div className="post-container" onClick={()=>{handleCardClick(user)}}>
                            {user}
                            {onlineUsers.includes(user) ? <p>online!!</p> : <p>offline</p>}
                        </div>
                    )
                }
                return null
            })}
        </>);
    }
    
}

export default Chat;