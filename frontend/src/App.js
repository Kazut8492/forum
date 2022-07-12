import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./links/Home"
import TestPage from "./links/TestPage"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`/`} element={<Home />} />
        <Route path={`/test/`} element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App