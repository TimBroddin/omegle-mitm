import React, {Component} from 'react'
import Omegle from '../omegle/Omegle';
import Head from 'next/head';
import Messages from '../components/Messages';

class OmegleView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            started: false
        }
    }

    componentDidMount() {}

    start(e) {
        e.preventDefault();
        this.setState({started: true});
        let c1 = new Omegle();
        let c2 = new Omegle();

        c1.on('message', (txt) => {
            let m = this.state.messages;
            m.push({type: 'Message', name: 'Person 1', id: c1.clientID, text: txt});
            this.setState({messages: m});
            c2.sendMessage(txt);
        });

        c2.on('message', (txt) => {
            let m = this.state.messages;
            m.push({type: 'Message', name: 'Person 2', id: c2.clientID, text: txt});
            this.setState({messages: m});
            c1.sendMessage(txt);
        });

        c1.on('serverMessage', (txt) => {
          let m = this.state.messages;
          m.push({type: 'Message', name: 'Server', id: c1.clientID, text: txt});
        });

        c2.on('serverMessage', (txt) => {
          let m = this.state.messages;
          m.push({type: 'Message', name: 'Server', id: c2.clientID, text: txt});
        });

        c1.on('typing', () => {
            c2.sendTyping();
        });

        c2.on('typing', () => {
            c1.sendTyping();
        });

        c1.on('typing', () => {
            c2.sendTyping();
        });

        c1.on('disconnect', () => {
            let m = this.state.messages;
            c1.start();
            c2.start();
            m.push({type: 'Disconnect'})
        });

        c2.on('disconnect', () => {
            let m = this.state.messages;

            c2.start();
            c2.start();
            m.push({type: 'Disconnect'})

        });

        c1.start();
        c2.start();

    }

    render() {
        let messages = [];
        let content;

        if (!this.state.started) {
            content = <div className="start">
                <a href="#" className="startBtn" onClick={this.start.bind(this)}>Start</a>
            </div>
        } else {

            content = <Messages messages={this.state.messages} />
        }

        return <div>
          <Head>
            <style>{`
                body {
                  font-family: Verdana;
                }

                .start {
                  width: 100vw;
                  height: 100vh;
                  display: flex;
                  justify-content: space-around;
                  align-items: center;
                }

                .startBtn {
                  text-decoration: none;
                  padding: 30px;
                  color: white;
                  background-color: #ed2d23;
                  border-radius: 15px;
                  font-size: 56px;
                }

                .messages {
                  width: 100vw;
                  height: 100vh;
                  overflow: auto;
                }

                .message {
                  display: flex;
                  margin-bottom: 3px;
                  align-items: center;
                }
                .nickName {
                  color: "#EFEFEF";
                  margin-right: 30px;
                  font-size: 11px;
                }
              `}</style>
          </Head>
          {content}
        </div>;

    }
}

export default OmegleView;
