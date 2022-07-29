import React, {useContext, useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import { connect, sendMsg } from "../api";
import {PostsContext} from "./PostsContext"


const Home = () => {
    const {posts, setPosts} = useContext(PostsContext)
    const [filterCategory, setFilterCategory] = useState("")
    const navigate = useNavigate();

    const handleFilterCategoryChange = (event) => {
        setFilterCategory(event.target.value)
    }

    const handleFilterSubmit = (event) => {
        event.preventDefault();
        // console.log(filterCategory)
        navigate(`/${filterCategory}/`, {state:"Category??"})
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
                    <form onSubmit={handleFilterSubmit}>
                        <h1>Filter posts</h1>
                        <select className="filter" value={filterCategory} name="filterCategory" onChange={handleFilterCategoryChange}>
                            <option value="all">Show all</option>
                            <option value="science">Science</option>
                            <option value="education">Education</option>
                            <option value="sports">Sports</option>
                            <option value="lifehacks">Lifehacks</option>
                        </select>
                        <button>Apply filter</button>
                    </form>
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