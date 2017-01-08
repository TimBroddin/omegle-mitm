import React, {Component} from 'react';

class Messages extends Component {
  componentDidUpdate() {
    this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
  }

  render() {
    const {messages} = this.props;

    return <div className="messages" ref="messages">
        {messages.map((message, k) => {
            if (message.type == 'Message') {
                return <div className="message" key={`message-${k}`}>
                    <span className="nickName">{message.name}</span>
                    <span className="message">{message.text}</span>
                </div>
            } else {
                return <hr key={`message-${k}`}/>
            }
        })}
    </div>
  }

}

export default Messages;
