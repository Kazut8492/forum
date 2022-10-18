import React, {useContext, useState, useEffect} from 'react';
import Message from './Message';
import {OnlineUsersContext} from './OnlineUsersContext';
import InfiniteScroll  from "react-infinite-scroller"

const ChatHistory = (props) => {
    const {chatHistory} = useContext(OnlineUsersContext);
    console.log("🚀 ~ file: ChatHistory.js ~ line 8 ~ ChatHistory ~ chatHistory", chatHistory);
    const messages = chatHistory.messages;
    const creatorUsername = props.creatorUsername;
    const receiverUsername = props.receiverUsername;

    // show first 10 messages in chatHistory and then load more messages when user scrolls to the top
    const [showMessages, setShowMessages] = useState(messages.slice(messages.length - 10, messages.length));
    console.log("🚀 ~ file: ChatHistory.js ~ line 14 ~ ChatHistory ~ showMessages", showMessages)
    const [hasMore, sethasMore] = useState(true);
    
    const loadMore = () => {
        if (showMessages.length === messages.length) {
            sethasMore(false);
        } else {
            const nextLength = messages.length - showMessages.length
            if (nextLength > 10) {
                const nextMessages = messages.slice(nextLength - 10, nextLength);
                setShowMessages([...nextMessages, ...showMessages]);
            } else {
                const nextMessages = messages.slice(0, nextLength);
                setShowMessages([...nextMessages, ...showMessages]);
            }
        }
    }

    useEffect(()=>{
        if (showMessages.length > 0 ) {
            setShowMessages([...showMessages, chatHistory.messages[chatHistory.messages.length-1]])
        }
    }, [chatHistory])

    //ロード中に表示する項目
    const loader =<div className="loader" key={0}>Loading ...</div>;

    // Scroll to the bottom, otherwise all the posts would get loaded when opening the page.
    window.scrollTo(0,document.body.scrollHeight)

    return(<div>
        <InfiniteScroll
            loadMore={loadMore}    //項目を読み込む際に処理するコールバック関数
            hasMore={hasMore}         //読み込みを行うかどうかの判定
            loader={loader}
            isReverse={true}
        >
            {showMessages && showMessages.map((message, index) => {
                if ((message.CreatorUsrName === creatorUsername && message.ReceiverUsrName === receiverUsername) || (message.CreatorUsrName === receiverUsername && message.ReceiverUsrName === creatorUsername)) {
                    return <Message message={message} />
                }
                return null;
            })}
      </InfiniteScroll>
    </div>);
}


export default ChatHistory;