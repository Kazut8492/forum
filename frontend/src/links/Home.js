import React, {useContext, useEffect, useState} from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { connect, sendMsg } from "../api";
import {PostsContext} from "./PostsContext"
import Navbar from "./Navbar"

const Home = () => {
    const [filterCategory, setFilterCategory] = useState()
    const [postTitle, setPostTitle] = useState("")
    const [postContent, setPostContent] = useState("")
    const [postCategory, setPostCategory] = useState([])
    const {posts, setPosts} = useContext(PostsContext)
    const navigate = useNavigate();
    const {category} = useParams();
    const categoryList = ["science", "education", "sports", "lifehacks"]

    // If user jumped to URL with category param, then set filter category with it.
    if (category && !filterCategory) {
        setFilterCategory(category)
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
            console.log(data)
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
                    {/* <form onSubmit={handleFilterSubmit}> */}
                    <form>
                        <h1>Filter posts</h1>
                        <select className="filter" value={filterCategory} name="filterCategory" onChange={e=>setFilterCategory(e.target.value)}>
                            <option value="all">Show all</option>
                            <option value="science">Science</option>
                            <option value="education">Education</option>
                            <option value="sports">Sports</option>
                            <option value="lifehacks">Lifehacks</option>
                        </select>
                        {/* <button>Apply filter</button> */}
                    </form>
                </div>
                <div className="allposts-container">
                    <div className="post-container">
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
                    </div>
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
                                    {/* need to add detail button and like & dislike button */}
                                </div>
                            </>);
                        }
                        return null;
                    })}
                </div>
            </main>
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