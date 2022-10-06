import React, {useState, useEffect, useContext} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import Navbar from './Navbar';
import { WebsocketContext } from './WebsocketContext';

const ChatRoom = () => {
    const params = useParams();
    // const location = useLocation();
    // const [chatHistory, setChatHistory] = useState(location.state.chatHistory ? location.state.chatHistory :[]);
    const [chatHistory, setChatHistory] = useState([]);
    // const [username, setUsername] = useState(localStorage.getItem("username"));

    const {connect, sendMsg} = useContext(WebsocketContext);

    // console.log("🚀 ~ file: ChatRoom.js ~ line 14 ~ ChatRoom ~ username", username)

    const receiverUsername = params.username;
    const creatorUsername = localStorage.getItem("username");
    console.log("🚀 ~ file: ChatRoom.js ~ line 19 ~ ChatRoom ~ creatorUsername", creatorUsername)

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
            const body = {type: "1", message: event.target.value, creator: creatorUsername, receiver: receiverUsername};
            const jsonBody = JSON.stringify(body);
            sendMsg(jsonBody);
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