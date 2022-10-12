import React, {createContext, useContext, useEffect} from 'react';
import { OnlineUsersContext } from './OnlineUsersContext';

const WebsocketContext = createContext();

const WebsocketProvider = (props) => {

    const {setOnlineUsers, sortedUsers, setSortedUsers, chatHistory, setChatHistory} = useContext(OnlineUsersContext);

    var socket = new WebSocket("ws://localhost:8080/ws");

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

    let connect = cb => {
        console.log("connecting");

        socket.onopen = () => {
            console.log("Successfully Connected");
        };

        socket.onmessage = msg => {
            console.log(msg);
            cb(msg);
        };

        socket.onclose = event => {
            console.log("Socket Closed Connection: ", event);
        };

        socket.onerror = error => {
            console.log("Socket Error: ", error);
        };
    };

    let sendMsg = msg => {
        console.log("sending msg: ", msg);
        socket.send(msg);
    };

    const value = {
        connect: connect,
        sendMsg: sendMsg
    }

    return (
        <WebsocketContext.Provider value={value}>
            {props.children}
        </WebsocketContext.Provider>
    )
}

export {WebsocketContext, WebsocketProvider};