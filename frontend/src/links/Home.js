import React from 'react';
import { connect, sendMsg } from "../api";

const Home = () => {
    connect()
    const send = () => {
      console.log("hello");
      sendMsg("hello");
    }
    return (<>
        <div className="App">
            <button onClick={send}>Click</button>
        </div>
    </>)
}

export default Home;