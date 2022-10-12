import React, {createContext, useContext, useEffect} from 'react';
import { OnlineUsersContext } from './OnlineUsersContext';

const WebsocketContext = createContext();

const WebsocketProvider = (props) => {

    var socket = new WebSocket("ws://localhost:8080/ws");

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