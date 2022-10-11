import React, {useContext} from 'react';
import Message from './Message';
import {OnlineUsersContext} from './OnlineUsersContext';

const ChatHistory = (props) => {
    const {chatHistory} = useContext(OnlineUsersContext);
    const messages = chatHistory.messages;
    const creatorUsername = props.creatorUsername;
    const receiverUsername = props.receiverUsername;
    return (
        <div className="chat-history">
            <h2>Chat History</h2>
            {messages && messages.map((message) => {
                if ((message.CreatorUsrName === creatorUsername && message.ReceiverUsrName === receiverUsername) || (message.CreatorUsrName === receiverUsername && message.ReceiverUsrName === creatorUsername)) {
                    return <Message message={message} />
                }
                return null;
            })}
        </div>
    );
}

export default ChatHistory;