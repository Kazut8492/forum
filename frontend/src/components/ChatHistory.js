import React from 'react';
import Message from './Message';

const ChatHistory = (props) => {
    const {messages} = props.chatHistory;
    return (
        <div className="chat-history">
            <h2>Chat History</h2>
            {messages && messages.map((message) => {
                return <Message message={message} />
            })}
        </div>
    );
}

export default ChatHistory;