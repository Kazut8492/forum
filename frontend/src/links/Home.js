import React, {useEffect, useState} from 'react';
import { connect, sendMsg } from "../api";


const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(()=>{
        fetch("http://localhost:8080/", {
            method:"GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type":"application/json",
            },
            redirect:"manual",
            referrer:"no-referrer"
        })
        .then(response=>response.json())
        .then(data=>{
            setPosts(data)
            console.log(data)
        })
        .catch(error=>console.log(error))
    },[]);

    return(
        <>
            <div>
                {posts && posts.map((post) => {
                    return <h1>{post.Title}</h1>
                })}
            </div>
        </>
    )
}

// const Home = () => {
//     connect()
//     const send = () => {
//       console.log("hello from Home.js");
//       sendMsg("hello");
//     }
//     return (<>
//         <div className="App">
//             <button onClick={send}>Click</button>
//         </div>
//     </>)
// }

export default Home;