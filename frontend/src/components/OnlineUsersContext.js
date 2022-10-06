import { createContext, useState, useEffect } from "react";

const OnlineUsersContext = createContext();

const OnlineUsersProvider = (props) => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(()=>{
        console.log(onlineUsers)
    }, [onlineUsers])

    const value = {
        onlineUsers: onlineUsers,
        setOnlineUsers: setOnlineUsers
    }

    return (
        <OnlineUsersContext.Provider value={value}>
            {props.children}
        </OnlineUsersContext.Provider>
    )
}

export {OnlineUsersContext, OnlineUsersProvider};