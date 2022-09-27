import React from 'react';
import Message from './Message';

const ChatHistory = (props) => {
    const {messages} = props.chatHistory;
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