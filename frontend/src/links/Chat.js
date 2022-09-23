import React, {useEffect, useState} from 'react';
import {connect, sendMsg} from "../api";
import Header from '../components/Header';
import ChatHistory from '../components/ChatHistory';
import ChatInput from '../components/ChatInput';

const Chat = () => {
    const [chatHistory, setChatHistory] = useState({messages:[]});

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
        sendMsg(event.target.value);
        event.target.value = "";
      }
    }

    return(<>
        <Header />
        <ChatHistory chatHistory={chatHistory} />
        <ChatInput send={handleInputSend} />
    </>);
}

export default Chat;