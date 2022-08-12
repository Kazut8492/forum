import React, { useState, useContext, useEffect } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { PostsContext } from "./PostsContext";

const Post = () => {
    // const location = useLocation();
    // const {post} = location.state
    const {posts, setPosts} = useContext(PostsContext)
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

    return (<>
        <nav className="nav-container">
            <ul className="nav-list">
                <li>
                    <Link to={`/posts/`}>Forum</Link>
                </li>
                <li>
                    <Link to={`/signup/`}>Sign up</Link>
                </li>
                <li>
                    <Link to={`/login/`}>Login</Link>
                </li>
            </ul>
        </nav>
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
                    <h1>Create a new comment</h1>
                    <form onSubmit={handleCommentSubmit}>
                        <p>Comment title:</p>
                        <input type="text" name="commentTitle" value={commentTitle} onChange={e=>{setCommentTitle(e.target.value)}} required />
                        <p>Comment text:</p>
                        <textarea value={commentContent} onChange={e=>{setCommentContent(e.target.value)}} name="commentDescription" placeholder="Enter text here..." id="commentDescription" required></textarea>
                        <input type="submit" value="Submit comment" />
                    </form>
                    <hr />
                    {post.Comments && post.Comments.map((comment)=>{
                        return (<>
                            <div className="comment">
                                <h4>{comment.Title}</h4>
                                <p>{comment.Content}</p>
                                <p>CommentID: {comment.ID}</p>
                                <p>Username: {comment.CreatorUsrName}</p>
                                {/* add like dislike button */}
                            </div>
                        </>)
                    })}
                </div>
            </div>
        </main>
    </>)
 }

 export default Post;