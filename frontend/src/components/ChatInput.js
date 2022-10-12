import React from 'react';

const ChatInput = (props) => {
  return (
    <div className="ChatInput">
      {/* this props.send is a function like onChange etc */}
      <p>Input box below</p>
      <input onKeyDown={props.send} />
    </div>
  );
};

export default ChatInput;