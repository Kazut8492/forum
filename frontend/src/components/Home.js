import React, {useContext, useEffect, useState} from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { PostsContext } from "./PostsContext";
import Navbar from "./Navbar";
import Chat from "./Chat";
import { CookieContext } from './CookieContext';
import { connect, sendMsg } from "./Index";
import {OnlineUsersContext} from "./OnlineUsersContext";

const Home = () => {
    const [filterCategory, setFilterCategory] = useState()
    const [postTitle, setPostTitle] = useState("")
    const [postContent, setPostContent] = useState("")
    const [postCategory, setPostCategory] = useState([])
    const {posts, setPosts} = useContext(PostsContext)
    const {cookieExist, setCookieExist} = useContext(CookieContext)
    const navigate = useNavigate();
    const {category} = useParams();
    const categoryList = ["science", "education", "sports", "lifehacks"]

    // If user jumped to URL with category param, then set filter category with it.
    if (category && !filterCategory) {
        setFilterCategory(category);
    }

    const handleCardClick = (post) => {
        // Padding area is clickable. Margin area is not.
        navigate(`/posts/${post.ID}`, {state:{post}})
    }

    // Here is posting part.
    const handlePostSubmit = (event) => {
        event.preventDefault();

        const newPost = {
            Title: postTitle,
            Content: postContent,
            CategoryArr: postCategory,
        }

        // Post to the server
        // It seems credential "include" and Access-Control-Allow-Origin in main.go has to be set at the same time.
        fetch("http://localhost:8080/new-post", {
            method:"POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(newPost)
        })
        .then(response=>response.json())
        .then(data=>{
            // Set returned, updated posts into state
            // console.log(data)
            setPosts(data)
            // Resetting the form.
            event.target.reset()
            setPostTitle("")
            setPostContent("")
        })
        .catch(error=>console.log(error))
    }

    const handleCategoryCheck = (event) => {
        let updatedPostCategory = [...postCategory]
        if (event.target.checked) {
            setPostCategory([...postCategory, event.target.value])
        } else {
            updatedPostCategory.splice(postCategory.indexOf(event.target.value), 1)
            setPostCategory(updatedPostCategory)
        }
    }

    const handleLikeClick = (event, postID, commentID) => {
        event.stopPropagation();

        const newLikePost = {
            PostId: postID,
            CommentId: commentID,
        }

        fetch("http://localhost:8080/like", {
            method:"POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(newLikePost)
        })
        .then(response=>response.json())
        .then(data=>{
            setPosts(data)
        })
        .catch(error=>console.log(error))
    }

    const handleDislikeClick = (event, postID, commentID) => {
        event.stopPropagation();

        const newDislikePost = {
            PostId: postID,
            CommentId: commentID,
        }

        fetch("http://localhost:8080/dislike", {
            method:"POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(newDislikePost)
        })
        .then(response=>response.json())
        .then(data=>{
            setPosts(data)
        })
        .catch(error=>console.log(error))
    }

    // // これを行うことで他のウィンドウにlogin/logoutなどのMessageEventを共有出来る、というか受け取る事ができる??
    // useEffect(() => {
    //     connect((msg) => {
    //         const dataObj = JSON.parse(msg.data);
    //         if (dataObj.type === 0) {
    //             if ((dataObj.body === "login" || dataObj.body === "signup") && !onlineUsers.includes(dataObj.ReceiverUsrName)) {
    //                 setOnlineUsers([...onlineUsers, dataObj.ReceiverUsrName]);
    //             } else if (dataObj.body === "logout" && onlineUsers.includes(dataObj.ReceiverUsrName)) {
    //                 setOnlineUsers(onlineUsers.filter(user => user !== dataObj.ReceiverUsrName));
    //             }
    //         }
    //     });
    // });

const {setOnlineUsers, sortedUsers, setSortedUsers, chatHistory, setChatHistory} = useContext(OnlineUsersContext);

// これを行うことで他のウィンドウにlogin/logoutなどのMessageEventを共有出来る、というか受け取る事ができる??
useEffect(() => {
    connect((msg) => {
        const dataObj = JSON.parse(msg.data);
        console.log("🚀 ~ file: WebsocketContext.js ~ line 16 ~ connect ~ dataObj", dataObj)
        if (dataObj.type === 0) {
            fetch("http://localhost:8080/online-users", {
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
                console.log("🚀 ~ file: WebsocketContext.js ~ line 31 ~ connect ~ data", data)
                let result = data ? data: [];
                setOnlineUsers(result)
            })
            .catch(error=>console.log(error))
            // if ((dataObj.body === "login" || dataObj.body === "signup") && !onlineUsers.includes(dataObj.ReceiverUsrName)) {
            //     setOnlineUsers([...onlineUsers, dataObj.ReceiverUsrName]);
            // } else if (dataObj.body === "logout" && onlineUsers.includes(dataObj.ReceiverUsrName)) {
            //     setOnlineUsers(onlineUsers.filter(user => user !== dataObj.ReceiverUsrName));
            // }
        } else if (dataObj.type === 1 && dataObj.CreatorUsrName !== "") {
            const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);
            console.log("🚀 ~ file: WebsocketContext.js ~ line 42 ~ connect ~ dataObj", dataObj)
            console.log("New message")
            const currentUser = localStorage.getItem("username");
            const otherUser = dataObj.CreatorUsrName === currentUser ? dataObj.ReceiverUsrName : dataObj.CreatorUsrName;
            const result = sortedUsers.filter(user => user !== otherUser);
            result.push(otherUser);
            setSortedUsers(result);
            console.log("🚀 ~ file: WebsocketContext.js ~ line 222 ~ connect ~ dataObj", dataObj)
            if (!equals(chatHistory.messages, [...chatHistory.messages, dataObj])) {
                setChatHistory({messages: [...chatHistory.messages, dataObj]});
            }
        }
    });
});

    useEffect(() => {
        if (categoryList.includes(filterCategory)) {
            navigate(`/posts/filter/${filterCategory}`)
        } else {
            navigate(`/posts`)
        }
        console.log(filterCategory)
    },[filterCategory])

    const styles = {
        hr : {
            width:"100%"
        },
    }

    return(
        <>
            <Navbar />
            <main>
                <div className="filter-container">
                    <form>
                        <h1>Filter posts</h1>
                        <select className="filter" value={filterCategory} name="filterCategory" onChange={e=>setFilterCategory(e.target.value)}>
                            <option value="all">Show all</option>
                            <option value="science">Science</option>
                            <option value="education">Education</option>
                            <option value="sports">Sports</option>
                            <option value="lifehacks">Lifehacks</option>
                        </select>
                    </form>
                </div>
                <div className="allposts-container">
                    {cookieExist && <div className="post-container">
                        <h1>Create a new post</h1>
                        <form onSubmit={handlePostSubmit}>
                            <p>Title:</p>
                            <input type="text" name="postTitle" value={postTitle} onChange={e => setPostTitle(e.target.value)} required />
                            <p>Text:</p>
                            <textarea type="text" name="postContent" placeholder="Enter text here..." id="postContent" value={postContent} onChange={e => setPostContent(e.target.value)} required></textarea>
                            <p>At least one category has to be selected</p>
                            <p>
                                <input type="checkbox" name="category" value="science" onChange={handleCategoryCheck} />Science
                                <input type="checkbox" name="category" value="education" onChange={handleCategoryCheck} />Education
                                <input type="checkbox" name="category" value="sports" onChange={handleCategoryCheck} />Sports
                                <input type="checkbox" name="category" value="lifehacks" onChange={handleCategoryCheck} />Lifehacks
                            </p>
                            <input value="Create a post" type="submit" />
                        </form>
                    </div>}
                    {posts && posts.map((post) => {
                        if (!filterCategory || filterCategory === "all" || post.CategoryArr.includes(filterCategory)){
                            return (<>
                                <div className='post-container' key={post.ID} onClick={()=>{handleCardClick(post)}}>
                                    <p className='title-text'>
                                        {post.Title}
                                    </p>
                                    {post.CategoryArr.map((category)=>{
                                        return <p className='category-text' key={category}>{category}</p>
                                    })}
                                    <hr style={styles.hr}></hr>
                                    <p className='post-text'>{post.Content}</p>
                                    <button disabled={cookieExist ? '': 'disabled'} onClick={(event)=>{handleLikeClick(event, post.ID)}}>{post.Likes ? post.Likes.length : 0} 👍</button>
                                    <button disabled={cookieExist ? '': 'disabled'} onClick={(event)=>{handleDislikeClick(event, post.ID)}}>{post.Dislikes ? post.Dislikes.length : 0} 👎</button>
                                </div>
                            </>);
                        }
                        return null;
                    })}
                    <Chat />
                </div>
            </main>
        </>
    )
}

export default Home;