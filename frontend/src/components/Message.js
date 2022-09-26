import React from 'react';

const Message = (props) => {
    const message = props.message;
    return (
        <div className="Message">
            <p>Message: {message && message.body}</p>
            <p>CreatorUsrName: {message && message.CreatorUsrName}</p>
            <p>ReceiverUsrname: {message && message.ReceiverUsrName}</p>
            <p>Time: {message && message.CreationTime}</p>
        </div>
    );
}

export default Message;