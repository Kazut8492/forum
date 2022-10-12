import React, {useEffect, useState, useContext} from 'react';
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";
import {OnlineUsersContext} from "./OnlineUsersContext";
import { CookieContext } from './CookieContext';
import { connect, sendMsg } from "./index";

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


const {onlineUsers, setOnlineUsers, sortedUsers, setSortedUsers, chatHistory, setChatHistory} = useContext(OnlineUsersContext);

// これを行うことで他のウィンドウにlogin/logoutなどのMessageEventを共有出来る、というか受け取る事ができる??
useEffect(() => {
    connect((msg) => {
        const dataObj = JSON.parse(msg.data);
        console.log("🚀 ~ file: WebsocketContext.js ~ line 16 ~ connect ~ dataObj", dataObj)
        if (dataObj.type === 0) {
            fetch("http://localhost:8080/online-users", {
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
                console.log("🚀 ~ file: WebsocketContext.js ~ line 31 ~ connect ~ data", data)
                let result = data ? data: [];
                setOnlineUsers(result)
            })
            .catch(error=>console.log(error))
            // if ((dataObj.body === "login" || dataObj.body === "signup") && !onlineUsers.includes(dataObj.ReceiverUsrName)) {
            //     setOnlineUsers([...onlineUsers, dataObj.ReceiverUsrName]);
            // } else if (dataObj.body === "logout" && onlineUsers.includes(dataObj.ReceiverUsrName)) {
            //     setOnlineUsers(onlineUsers.filter(user => user !== dataObj.ReceiverUsrName));
            // }
        } else if (dataObj.type === 1 && dataObj.CreatorUsrName !== "") {
            const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);
            console.log("🚀 ~ file: WebsocketContext.js ~ line 42 ~ connect ~ dataObj", dataObj)
            console.log("New message")
            const currentUser = localStorage.getItem("username");
            const otherUser = dataObj.CreatorUsrName === currentUser ? dataObj.ReceiverUsrName : dataObj.CreatorUsrName;
            const result = sortedUsers.filter(user => user !== otherUser);
            result.push(otherUser);
            setSortedUsers(result);
            console.log("🚀 ~ file: WebsocketContext.js ~ line 222 ~ connect ~ dataObj", dataObj)
            if (!equals(chatHistory.messages, [...chatHistory.messages, dataObj])) {
                setChatHistory({messages: [...chatHistory.messages, dataObj]});
            }
        }
    });
});

    if (!cookieExist) {
        // If Chat component is in '/posts', it would case an infinite loop.
        // navigate("/posts");
        return
    } else {
        return(<>
            {/* <Navbar /> */}
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