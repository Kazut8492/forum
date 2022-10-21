import React, {useEffect, useState, useContext} from 'react';
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";
import {OnlineUsersContext} from "./OnlineUsersContext";
import { CookieContext } from './CookieContext';

const Chat = () => {
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const navigate = useNavigate();
    // const {onlineUsers, sortedUsers, chatHistory, allUsersData, setChatHistory} = useContext(OnlineUsersContext);
    const {cookieExist} = useContext(CookieContext);

    const handleCardClick = (sortedUsers) => {
        navigate(`/chatroom/${sortedUsers}`, {state:{chatHistory}})
        // need to reload. Otherwise, old username shown up on creatorUsername of the messages
        // window.location.reload();
    }

    const {onlineUsers, sortedUsers, chatHistory} = useContext(OnlineUsersContext);

    if (!cookieExist) {
        // If Chat component is in '/posts', it would case an infinite loop.
        // navigate("/posts");
        return
    } else {
        return(<div className='chat-list'>
            {sortedUsers && sortedUsers.map(user => {
                if (user !== username) {
                    return (
                        <div className="post-container" onClick={()=>{
                            if (onlineUsers && onlineUsers.includes(user)) {
                                return handleCardClick(user)
                            } else {
                                return null;
                            }
                        }}>
                            {user}
                            {onlineUsers && onlineUsers.includes(user) ? <p>online!!</p> : <p>offline</p>}
                        </div>
                    )
                }
                return null
            })}
        </div>);
    }
    
}

export default Chat;