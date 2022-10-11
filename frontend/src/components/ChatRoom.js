import React, {useState, useEffect, useContext} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import Navbar from './Navbar';
import { WebsocketContext } from './WebsocketContext';
import {OnlineUsersContext} from "./OnlineUsersContext";

const ChatRoom = () => {
    const params = useParams();
    // const location = useLocation();
    // const [chatHistory, setChatHistory] = useState(location.state.chatHistory ? location.state.chatHistory :[]);
    // const [username, setUsername] = useState(localStorage.getItem("username"));

    const {connect, sendMsg} = useContext(WebsocketContext);

    // console.log("🚀 ~ file: ChatRoom.js ~ line 14 ~ ChatRoom ~ username", username)


    const receiverUsername = params.username;
    const creatorUsername = localStorage.getItem("username");
    console.log("🚀 ~ file: ChatRoom.js ~ line 19 ~ ChatRoom ~ creatorUsername", creatorUsername)

    const handleInputSend = (event) => {
        if(event.keyCode === 13) {
            const body = {type: "1", message: event.target.value, creator: creatorUsername, receiver: receiverUsername};
            const jsonBody = JSON.stringify(body);
            sendMsg(jsonBody);
            event.target.value = "";
        }
    }

    return (<>
        <Navbar />
        <ChatHistory creatorUsername={creatorUsername} receiverUsername={receiverUsername} />
        <ChatInput send={handleInputSend} />
    </>)
}

export default ChatRoom;