import { createContext, useState } from "react";

const OnlineUserContext = createContext();

const OnlineUserProvider = (props) => {
    const [onlineUser, setOnlineUser] = useState([]);

    const value = {
        onlineUser: onlineUser,
        setOnlineUser: setOnlineUser
    }

    return (
        <OnlineUserContext.Provider value={value}>
            {props.children}
        </OnlineUserContext.Provider>
    )
}

export {OnlineUserContext, OnlineUserProvider};