import React, {useContext} from 'react';
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
import { OnlineUsersProvider } from './components/OnlineUsersContext';


const App = () => {
  return (
    <BrowserRouter>
      <CookieProvider>
        <PostsProvider>
          <OnlineUsersProvider>
            <Routes>
              <Route path={`/posts/filter/:category`} element={<Home />} />
              <Route path={`/posts/`} element={<Home />} />
              <Route path={`/posts/:id`} element={<Post />} />
              <Route path={`/`} element={<Home />} />
              <Route path={`/signup/`} element={<Signup />} />
              <Route path={`/login/`} element={<Login />} />
              {/* <Route path={`/chat/`} element={<Chat />} /> */}
              <Route path={`/chatroom/:username`} element={<ChatRoom />} />
            </Routes>
          </OnlineUsersProvider>
        </PostsProvider>
      </CookieProvider>
    </BrowserRouter>
  )
}

export default App