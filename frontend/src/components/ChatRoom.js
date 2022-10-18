import React, {useState, useEffect, useContext} from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import Navbar from './Navbar';
import { connect, sendMsg } from "./index";
import {OnlineUsersContext} from "./OnlineUsersContext";
import {CookieContext} from "./CookieContext";

const ChatRoom = () => {
    const params = useParams();
    const navigate = useNavigate();
    const {cookieExist, setCookieExist} = useContext(CookieContext)
    // const location = useLocation();
    // const [chatHistory, setChatHistory] = useState(location.state.chatHistory ? location.state.chatHistory :[]);
    // const [username, setUsername] = useState(localStorage.getItem("username"));

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

    const {setOnlineUsers, sortedUsers, setSortedUsers, chatHistory, setChatHistory} = useContext(OnlineUsersContext);

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
        navigate("/login/")
        return
    } else {
    return (<>
        <Navbar />
        <ChatHistory creatorUsername={creatorUsername} receiverUsername={receiverUsername} />
        <ChatInput send={handleInputSend} />
    </>)
    }
}

export default ChatRoom;