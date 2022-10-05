import { createContext, useState } from "react";

const OnlineUserContext = createContext();

const OnlineUserProvider = (props) => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    const value = {
        onlineUsers: onlineUsers,
        setOnlineUsers: setOnlineUsers
    }

    return (
        <OnlineUserContext.Provider value={value}>
            {props.children}
        </OnlineUserContext.Provider>
    )
}

export {OnlineUserContext, OnlineUserProvider};