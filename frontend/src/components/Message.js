import React from 'react';

const Message = (props) => {
    const message = props.message;
    return (
        <div className="Message">
            <p>{message && message.body}</p>
        </div>
    );
}

export default Message;