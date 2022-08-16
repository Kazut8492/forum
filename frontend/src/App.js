import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./links/Home"
import Signup from "./links/Signup"
import Login from "./links/Login"
import Post from './links/Post';
import {PostsProvider} from "./links/PostsContext"
import {CookieProvider} from './links/CookieContext';

const App = () => {
  return (
    <BrowserRouter>
      <CookieProvider>
        <PostsProvider>
          <Routes>
            <Route path={`/posts/filter/:category`} element={<Home />} />
            <Route path={`/posts/`} element={<Home />} />
            <Route path={`/posts/:id`} element={<Post />} />
            <Route path={`/signup/`} element={<Signup />} />
            <Route path={`/login/`} element={<Login />} />
          </Routes>
        </PostsProvider>
      </CookieProvider>
    </BrowserRouter>
  )
}

export default App