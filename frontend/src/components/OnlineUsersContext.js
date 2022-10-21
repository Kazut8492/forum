import { createContext, useState, useEffect } from "react";
import { connect, sendMsg } from "./Index";

const OnlineUsersContext = createContext();

const OnlineUsersProvider = (props) => {
    const [allUsersData, setAllUsersData] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sortedUsers, setSortedUsers] = useState([]);
    const [chatHistory, setChatHistory] = useState({messages:[]});

        // これを行うことで他のウィンドウにlogin/logoutなどのMessageEventを共有出来る、というか受け取る事ができる??
        useEffect(() => {
            connect((msg) => {
                const dataObj = JSON.parse(msg.data);
                console.log("🚀 ~ file: WebsocketContext.js ~ line 16 ~ connect ~ dataObj", dataObj)
                if (dataObj.type === 0) {
                    const onlineusers = [...dataObj.onlineUsers]
                    setOnlineUsers(onlineusers)
                    console.log("🚀 ~ file: OnlineUsersContext.js ~ line 19 ~ connect ~ dataObj.onlineUsers", onlineusers)
                } else if (dataObj.type === 1 && dataObj.CreatorUsrName !== "") {
                    const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);
                    console.log("🚀 ~ file: WebsocketContext.js ~ line 42 ~ connect ~ dataObj", dataObj)
                    console.log("New message")
                    const currentUser = localStorage.getItem("username");
                    const otherUser = dataObj.CreatorUsrName === currentUser ? dataObj.ReceiverUsrName : dataObj.CreatorUsrName;
                    const result = sortedUsers.filter(user => user !== otherUser);
                    result.push(otherUser);
                    setSortedUsers([...result]);
                    console.log("🚀 ~ file: WebsocketContext.js ~ line 222 ~ connect ~ dataObj", dataObj)
                    if (!equals(chatHistory.messages, [...chatHistory.messages, dataObj])) {
                        setChatHistory({messages: [...chatHistory.messages, dataObj]});
                    }
                }
            });
        });

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
            console.log("Initiall")
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
            setAllUsersData([...data]);

            // currentUserが空の時にバグりそう。
            const currentUser = localStorage.getItem("username");

            let allUsernames = data.map(user => user.Username).filter(username => username !== currentUser);
            // sort allUsernames in alphabetical order
            let result = allUsernames.sort();

            chatHistory.messages.forEach((element)=>{
                if ((element.CreatorUsrName === currentUser || element.ReceiverUsrName === currentUser)) {
                    const otherUser = element.CreatorUsrName === currentUser ? element.ReceiverUsrName : element.CreatorUsrName;
                    if (result.includes(otherUser)) {
                        result = result.filter(user => user !== otherUser);
                    }
                    result.unshift(otherUser);
                }
            });
            setSortedUsers([...result]);

        })
        .catch(error => console.log(error));
    }, [chatHistory, onlineUsers]);

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