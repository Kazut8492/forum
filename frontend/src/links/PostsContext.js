import { createContext, useState, useEffect } from "react";

const PostsContext = createContext();

const PostsProvider = (props) => {
    const [posts, setPosts] = useState([]);

    useEffect(()=>{
        fetch("http://localhost:8080/posts", {
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
            setPosts(data)
        })
        .catch(error=>console.log(error))
    },[]);

    const value = {
        posts,
        setPosts
    }

    return (
        <PostsContext.Provider value={value}>
            {props.children}
        </PostsContext.Provider>
    )
}

export {PostsContext, PostsProvider};