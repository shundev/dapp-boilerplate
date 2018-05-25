import React, { Component } from 'react'
import PropTypes from 'prop-types'
import getWeb3 from './getWeb3'

import ChatInput from './ChatInput'
import ChatHistory from './ChatHistory'

// import './App.styl'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userAddress: "0x0",
      history: [],
      web3: null,
      contractInstance: null,
    }

    this.sendMessage = this.sendMessage.bind(this)
    this.initContract = this.initContract.bind(this)
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      this.initContract();
      this.initAccount();
    })

  }

  initContract() {
    const contractAddress = "0xfd7dbb201772ef19957090c6eb1aa0a81794692e"
    const contractABI = [ { "anonymous": false, "inputs": [ { "indexed": true, "name": "id", "type": "uint256" }, { "indexed": true, "name": "sender", "type": "address" }, { "indexed": true, "name": "receiver", "type": "address" }, { "indexed": false, "name": "text", "type": "string" }, { "indexed": false, "name": "created_at", "type": "uint256" } ], "name": "MessageSent", "type": "event" }, { "constant": false, "inputs": [ { "name": "receiver", "type": "address" }, { "name": "text", "type": "string" } ], "name": "sendMessage", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": true, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "getMessage", "outputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "string" }, { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "theother", "type": "address" } ], "name": "getMessages", "outputs": [ { "name": "", "type": "uint256[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "messages", "outputs": [ { "name": "sender", "type": "address" }, { "name": "receiver", "type": "address" }, { "name": "text", "type": "string" }, { "name": "created_at", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]

    const instance = new this.state.web3.eth.Contract(contractABI, contractAddress)
    this.setState({
      contractInstance: instance,
    }, () => {
      //DEBUG: To ensure connection to contract
      this.state.contractInstance.methods.getMessage(1).call().then(console.log)
    })
  }

  initAccount() {
    this.state.web3.eth.getAccounts((err, accounts) => {
      this.setState({
        userAddress: accounts[0],
      })
    })
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
