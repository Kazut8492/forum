import React from 'react';

const ChatHistory = (props) => {
    const {messages} = props.chatHistory;
    return (
        <div className="chat-history">
            <h2>Chat History</h2>
            {messages.map((message, index) => {
                return (
                    <div key={index}>
                        <p>{message}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default ChatHistory;