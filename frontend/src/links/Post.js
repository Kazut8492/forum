import React from "react";
import { useLocation } from "react-router-dom";

const Post = () => { 
    const location = useLocation();
    const {postID} = location.state
    console.log(postID)
    // URLからid取れるかも。

    return (<></>)
 }

 export default Post;