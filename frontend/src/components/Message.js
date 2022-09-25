import React from 'react';

const Message = (props) => {
    const message = props.message;
    return (
        <div className="Message">
            <p>Message: {message && message.body}</p>
            <p>Username: {message && message.CreatorUsrName}</p>
            <p>Time: {message && message.CreationTime}</p>
        </div>
    );
}

export default Message;