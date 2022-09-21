import React from 'react';

const ChatInput = (props) => {
  return (
    <div className="ChatInput">
      {/* this props.send is a function like onChange etc */}
      <input onKeyDown={props.send} />
    </div>
  );
};

export default ChatInput;