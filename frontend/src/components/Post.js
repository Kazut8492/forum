import React, { useState, useContext, useEffect } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { PostsContext } from "./PostsContext";
import Navbar from "./Navbar";
import { CookieContext } from "./CookieContext";

const Post = () => {
    // const location = useLocation();
    // const {post} = location.state
    const {posts, setPosts} = useContext(PostsContext);
    const {cookieExist, setCookieExist} = useContext(CookieContext)
    const [commentTitle, setCommentTitle] = useState('')
    const [commentContent, setCommentContent] = useState('')
    const params = useParams();
    // console.log(params)

    const thisPostIndex = posts.findIndex((post)=>{
        return post.ID === parseInt(params.id);
    })
    const post = posts[thisPostIndex]

    const handleCommentSubmit = (event) => {
        event.preventDefault();

        const newComment = {
            PostId: post.ID,
            Title: commentTitle,
            Content: commentContent,
        }

        fetch("http://localhost:8080/new-comment", {
            method:"POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(newComment)
        })
        .then(response=>response.json())
        .then(data=>{
            setPosts(data)
            event.target.reset()
            setCommentTitle('')
            setCommentContent('')
        })
        .catch(error=>console.log(error))
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

    return (
        <>
            <Navbar />
            <main>
                <div className="allposts-container">
                    <div className="post-container">
                        <h1>
                            {post.Title}
                        </h1>
                        <h2>
                            {post.Content}
                        </h2>
                        <p>category: {post.CategoryArr.join().replace(',', ' | ')}</p>
                        <hr />
                        {cookieExist && <>
                            <h1>Create a new comment</h1>
                            <form onSubmit={handleCommentSubmit}>
                                <p>Comment title:</p>
                                <input type="text" name="commentTitle" value={commentTitle} onChange={e=>{setCommentTitle(e.target.value)}} required />
                                <p>Comment text:</p>
                                <textarea value={commentContent} onChange={e=>{setCommentContent(e.target.value)}} name="commentDescription" placeholder="Enter text here..." id="commentDescription" required></textarea>
                                <input type="submit" value="Submit comment" />
                            </form>
                            <hr />
                        </>}
                        {post.Comments && post.Comments.map((comment)=>{
                            return (<>
                                <div className="comment">
                                    <h4>{comment.Title}</h4>
                                    <p>{comment.Content}</p>
                                    <p>CommentID: {comment.ID}</p>
                                    <p>Username: {comment.CreatorUsrName}</p>
                                    <button onClick={(event)=>{handleDislikeClick(event, post.ID, comment.ID)}}>{comment.Dislikes ? comment.Dislikes.length : 0} 👎</button>
                                    <button onClick={(event)=>{handleLikeClick(event, post.ID, comment.ID)}}>{comment.Likes ? comment.Likes.length : 0} 👍</button>
                                    <hr />
                                </div>
                            </>)
                        })}
                    </div>
                </div>
            </main>
        </>
    )
 }

 export default Post;