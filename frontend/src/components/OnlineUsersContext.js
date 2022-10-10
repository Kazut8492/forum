import { createContext, useState, useEffect } from "react";

const OnlineUsersContext = createContext();

const OnlineUsersProvider = (props) => {
    const [allUsersData, setAllUsersData] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sortedUsers, setSortedUsers] = useState([]);
    const [chatHistory, setChatHistory] = useState({messages:[]});

    useEffect(()=>{
        fetch("http://localhost:8080/chatHistory", {
            method:"GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type":"application/json",
            },
            redirect:"manual",
            referrer:"no-referrer"
        })
        .then(response=>response.json())
        .then(data=>{
            let result = data ? data: [];
            console.log({messages: result})
            setChatHistory({messages: result})
        })
        .catch(error=>console.log(error))
    },[]);

    useEffect(() => {
        fetch("http://localhost:8080/all-users", {
            method:"GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type":"application/json",
            },
            redirect:"manual",
            referrer:"no-referrer"
        })
        .then(response => response.json())
        .then(data => {
            setAllUsersData(data);

            // currentUserが空の時にバグりそう。
            const currentUser = localStorage.getItem("username");

            let allUsernames = data.map(user => user.Username).filter(username => username !== currentUser);
            // sort allUsernames in alphabetical order
            allUsernames.sort();
            let result = allUsernames;

            for (let i = chatHistory.messages.length-1; i >= 0; i--) {
                const element = chatHistory.messages[i];
                if ((element.CreatorUsrName === currentUser || element.ReceiverUsrName === currentUser)) {
                    const otherUser = element.CreatorUsrName === currentUser ? element.ReceiverUsrName : element.CreatorUsrName;
                    if (allUsernames.includes(otherUser)) {
                        result = result.filter(user => user !== otherUser);
                        result.push(otherUser);
                        allUsernames = allUsernames.filter(username => username !== otherUser)
                    }
                    if (allUsernames.length === 0) {
                        break;
                    }
                }
            }
            setSortedUsers(result);
            console.log("🚀 ~ file: OnlineUsersContext.js ~ line 72 ~ useEffect ~ result", result)

        })
        .catch(error => console.log(error));
    }, [chatHistory]);

    useEffect(()=>{
        console.log(onlineUsers)
    }, [onlineUsers])

    const value = {onlineUsers, setOnlineUsers, sortedUsers, setSortedUsers, chatHistory, setChatHistory, allUsersData, setAllUsersData};

    return (
        <OnlineUsersContext.Provider value={value}>
            {props.children}
        </OnlineUsersContext.Provider>
    )
}

export {OnlineUsersContext, OnlineUsersProvider};