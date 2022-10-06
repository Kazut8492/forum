import React, {useEffect, useState, useContext} from 'react';
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";
import {OnlineUsersContext} from "./OnlineUsersContext";

const Chat = () => {
    const [chatHistory, setChatHistory] = useState({messages:[]});
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const {onlineUsers} = useContext(OnlineUsersContext);

    useEffect(() => {
        fetch("http://localhost:8080/all-users", {
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
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setUsers(data);
        })
        .catch(error => console.log(error));
    }, []);

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
            console.log(data)
            let result = data ? data: [];
            console.log({messages: result})
            setChatHistory({messages: result})
        })
        .catch(error=>console.log(error))
    },[]);

    const handleCardClick = (selectedUser) => {
        navigate(`/chatroom/${selectedUser.Username}`, {state:{chatHistory}})
        // need to reload. Otherwise, old username shown up on creatorUsername of the messages
        // window.location.reload();
    }
    
    return(<>
        <Navbar />
        {users && users.map(user => {
            if (user.Username !== username) {
                return (
                    <div className="post-container" onClick={()=>{handleCardClick(user)}}>
                        {user.Username}
                    </div>
                )
            }
            return null
        })}
    </>);
}

export default Chat;