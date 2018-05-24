import React, { Component } from 'react'
import ChatInput from './ChatInput'
import ChatHistory from './ChatHistory'

// import './App.styl'

class App extends Component {
  render() {
    return (
      <div className="App">
        <ChatHistory />
        <ChatInput />
      </div>
    );
  }
}

export default App
