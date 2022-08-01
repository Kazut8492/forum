import React from "react";
import { useLocation, Link } from "react-router-dom";

const Post = () => { 
    const location = useLocation();
    const {post} = location.state

    console.log(post)

    // There are two ways to get a post.
    // One way is using useContext and compare the posdIDs.
    // The other way is passing a selected post as state from Home.

    return (<>
        <nav className="nav-container">
            <ul className="nav-list">
                <li>
                    <Link to={`/`}>Forum</Link>
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