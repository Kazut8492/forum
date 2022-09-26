import React, {useState, useEffect} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {connect, sendMsg} from "../api";
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import Navbar from './Navbar';

const ChatRoom = () => {
    const params = useParams();
    const location = useLocation();
    const [chatHistory, setChatHistory] = useState(location.state.chatHistory ? location.state.chatHistory :[]);
  
    const receiverUsername = params.username;

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
        <ChatHistory chatHistory={chatHistory} />
        <ChatInput send={handleInputSend} />
    </>)
}

export default ChatRoom;