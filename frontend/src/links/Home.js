import React, {useContext, useEffect, useState} from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { connect, sendMsg } from "../api";
import {PostsContext} from "./PostsContext"


const Home = () => {
    const {posts, setPosts} = useContext(PostsContext)
    const [filterCategory, setFilterCategory] = useState()
    const navigate = useNavigate();
    const {category} = useParams();

    // if (["science", "education", "sports", "lifehacks"].includes(category)) {
    //     navigate(`/${category}`)
    // }

    // これが決め手。
    if (category && !filterCategory) {
        setFilterCategory(category)
    }


    // useEffect(()=>{
    //     setFilterCategory(category)
    // },[category])

    const handleFilterCategoryChange = (event) => {
        setFilterCategory(event.target.value)
    }

    useEffect(() => {
        if (filterCategory && !["all", "science", "education", "sports", "lifehacks"].includes(filterCategory)) {
            navigate(`/`)
        } else if (filterCategory && filterCategory !== "all") {
            navigate(`/${filterCategory}`)
        } else {
            navigate(`/`)
        }
    },[filterCategory])

    useEffect(()=>{
        console.log(category)
    }, [category])

    const styles = {
        hr : {
            width:"100%"
        },
    }

    return(
        <>
            <nav className="nav-container">
                <ul className="nav-list">
                    <li>
                        <Link
                            to={`/`}
                        >
                            Forum
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={`/signup/`}
                        >
                            Sign up
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={`/login/`}
                        >
                            Login
                        </Link>
                    </li>
                </ul>
            </nav>
            <main>
                <div className="filter-container">
                    {/* <form onSubmit={handleFilterSubmit}> */}
                    <form>
                        <h1>Filter posts</h1>
                        <select className="filter" value={filterCategory} name="filterCategory" onChange={handleFilterCategoryChange}>
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
                    {posts && posts.map((post) => {
                        if (!filterCategory || filterCategory === "all" || post.CategoryArr.includes(filterCategory)){
                            return (<>
                                <div className='post-container' key={post.Id}>
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