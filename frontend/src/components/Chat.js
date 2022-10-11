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
                console.log("🚀 ~ file: Chat.js ~ line 26 ~ Chat ~ user", user)
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