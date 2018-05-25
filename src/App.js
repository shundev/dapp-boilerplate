import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ChatInput from './ChatInput'
import ChatHistory from './ChatHistory'

// import './App.styl'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userAddress: "0x091225B0D977922de7483e65e24bb9d17dF687EC",
      history: [],
    }

    this.sendMessage = this.sendMessage.bind(this)
  }

  sendMessage(message) {
    this.setState({
      history: this.state.history.concat(message)
    })
  }

  render() {
    return (
      <div className="App">
        <ChatHistory history={ this.state.history } />
        <ChatInput userAddress={ this.state.userAddress } sendMessage={ this.sendMessage } />
      </div>
    );
  }
}

export default App
