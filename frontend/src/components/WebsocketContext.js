import React, {createContext, useContext, useEffect} from 'react';
import { OnlineUsersContext } from './OnlineUsersContext';

const WebsocketContext = createContext();

const WebsocketProvider = (props) => {

    const {onlineUsers, setOnlineUsers} = useContext(OnlineUsersContext);

    var socket = new WebSocket("ws://localhost:8080/ws");

    // useEffect(() => {
    //     connect((msg) => {
    //         setChatHistory({messages: [...chatHistory.messages, JSON.parse(msg.data)]});
    //     });
    // });

    // これを行うことで他のウィンドウにlogin/logoutなどのMessageEventを共有出来る、というか受け取る事ができる??
    useEffect(() => {
        connect((msg) => {
            const dataObj = JSON.parse(msg.data);
            if (dataObj.type === 0) {
                if ((dataObj.body === "login" || dataObj.body === "signup") && !onlineUsers.includes(dataObj.ReceiverUsrName)) {
                    setOnlineUsers([...onlineUsers, dataObj.ReceiverUsrName]);
                } else if (dataObj.body === "logout" && onlineUsers.includes(dataObj.ReceiverUsrName)) {
                    setOnlineUsers(onlineUsers.filter(user => user !== dataObj.ReceiverUsrName));
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

            // const dataObj = JSON.parse(msg.data);
            // if (dataObj.type === 0) {
            //     if ((dataObj.body === "login" || dataObj.body === "signup") && !onlineUsers.includes(dataObj.ReceiverUsrName)) {
            //         setOnlineUsers([...onlineUsers, dataObj.ReceiverUsrName]);
            //     } else if (dataObj.body === "logout" && onlineUsers.includes(dataObj.ReceiverUsrName)) {
            //         setOnlineUsers(onlineUsers.filter(user => user !== dataObj.ReceiverUsrName));
            //     }
            // }

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