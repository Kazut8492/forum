import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Post from './components/Post';
import Chat from './components/Chat';
import ChatRoom from './components/ChatRoom';
import {PostsProvider} from "./components/PostsContext"
import {CookieProvider} from './components/CookieContext';
import { OnlineUserProvider } from './components/OnlineUserContext';

var socket = new WebSocket("ws://localhost:8080/ws");

let connect = cb => {
    console.log("connecting");
  
    socket.onopen = () => {
      console.log("Successfully Connected");
    };
  
    socket.onmessage = msg => {
      console.log(msg);
      if (JSON.parse(msg.data).type === 1) {
        console.log("message type is 1, chat message")
      } else if (JSON.parse(msg.data).type === 0) {
        console.log("message type is 0, system message")
      }
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

const App = () => {
  return (
    <BrowserRouter>
      <CookieProvider>
        <PostsProvider>
          <OnlineUserProvider>
            <Routes>
              <Route path={`/posts/filter/:category`} element={<Home />} />
              <Route path={`/posts/`} element={<Home />} />
              <Route path={`/posts/:id`} element={<Post />} />
              <Route path={`/signup/`} element={<Signup />} />
              <Route path={`/login/`} element={<Login />} />
              <Route path={`/chat/`} element={<Chat />} />
              <Route path={`/chatroom/:username`} element={<ChatRoom />} />
            </Routes>
          </OnlineUserProvider>
        </PostsProvider>
      </CookieProvider>
    </BrowserRouter>
  )
}

export { connect, sendMsg };

export default App