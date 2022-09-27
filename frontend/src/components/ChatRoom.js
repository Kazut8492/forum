import React, {useState, useEffect} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {connect, sendMsg} from "../api";
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import Navbar from './Navbar';

const ChatRoom = () => {
    const params = useParams();
    // const location = useLocation();
    // const [chatHistory, setChatHistory] = useState(location.state.chatHistory ? location.state.chatHistory :[]);
    const [chatHistory, setChatHistory] = useState([]);

    const receiverUsername = params.username;
    const creatorUsername = localStorage.getItem("username");

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

    useEffect(() => {
        connect((msg) => {
            setChatHistory({messages: [...chatHistory.messages, JSON.parse(msg.data)]});
        });
    });

    const handleInputSend = (event) => {
        if(event.keyCode === 13) {
            const body = {message: event.target.value, receiver: receiverUsername};
            const jsonBody = JSON.stringify(body);
            sendMsg(jsonBody);
            // sendMsg(event.target.value);
            event.target.value = "";
        }
    }

    return (<>
        <Navbar />
        <ChatHistory chatHistory={chatHistory} creatorUsername={creatorUsername} receiverUsername={receiverUsername} />
        <ChatInput send={handleInputSend} />
    </>)
}

export default ChatRoom;