import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./links/Home"
import TestPage from "./links/TestPage"
import Signup from "./links/Signup"
import Login from "./links/Login"
import Post from './links/Post';
import {PostsProvider} from "./links/PostsContext"

const App = () => {
  return (
    <BrowserRouter>
      <PostsProvider>
        <Routes>
          <Route path={`/:category`} element={<Home />} />
          <Route path={`/`} element={<Home />} />
          <Route path={`/posts/:id`} element={<Post />} />
          <Route path={`/test/`} element={<TestPage />} />
          <Route path={`/signup/`} element={<Signup />} />
          <Route path={`/login/`} element={<Login />} />
        </Routes>
      </PostsProvider>
    </BrowserRouter>
  )
}

export default App