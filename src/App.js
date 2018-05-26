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

      this.initAccount(this.initContract);
    })
  }

  componentDidMount() {
    console.log("App#componentDidMount")
  }

  initContract() {
    const contractAddress = "0x4300a0d23f0b406ba88b4ce2d4c07cb8821c30a9"
    const contractABI = [ { "anonymous": false, "inputs": [ { "indexed": true, "name": "id", "type": "uint256" }, { "indexed": true, "name": "sender", "type": "address" }, { "indexed": true, "name": "receiver", "type": "address" }, { "indexed": false, "name": "text", "type": "string" }, { "indexed": false, "name": "created_at", "type": "uint256" } ], "name": "MessageSent", "type": "event" }, { "constant": false, "inputs": [ { "name": "receiver", "type": "address" }, { "name": "text", "type": "string" } ], "name": "sendMessage", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": true, "inputs": [ { "name": "id", "type": "uint256" } ], "name": "getMessage", "outputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "string" }, { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "theother", "type": "address" } ], "name": "getMessages", "outputs": [ { "name": "", "type": "uint256[20]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "messages", "outputs": [ { "name": "sender", "type": "address" }, { "name": "receiver", "type": "address" }, { "name": "text", "type": "string" }, { "name": "created_at", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]

    const instance = new this.state.web3.eth.Contract(contractABI, contractAddress)

    // instance.events.MessageSent({filter: })

    this.setState({
      contractInstance: instance,
    }, this.getHistory)
  }

  initAccount(callback) {
    this.state.web3.eth.getAccounts((err, accounts) => {
      this.setState({
        userAddress: accounts[0],
      }, callback)
    })
  }

  sendMessage(message) {
    // Temporary message (not mined)
    const msgObj = {
      Id: Math.floor(Math.random() * 100000000),
      Who: this.state.userAddress,
      What: message,
      When: (new Date().valueOf()) / 1000
    }
    this.setState({
      history: this.state.history.concat(msgObj)
    })

    // FIXME: receiver address
    this.state.contractInstance.methods.sendMessage("0xe31c5b5731f3Cba04f8CF3B1C8Eb6FCbdC66f4B5", message).send({from: this.state.userAddress})
    .on("receipt", function (receipt) {
      getHistory()
    })
  }

  getHistory() {
    //FIXME: 本当のReceiverに切り替え
    this.state.contractInstance.methods.getMessages("0xe31c5b5731f3Cba04f8CF3B1C8Eb6FCbdC66f4B5").call({from: this.state.userAddress})
      .then(messageIds => {
          for (var i=0; i < messageIds.length; i++) {
            if (messageIds[i] == 0) break;
            this.state.contractInstance.methods.getMessage(messageIds[i]).call({from: this.state.userAddress})
            .then(message => {
              this.setState({
                history: this.state.history.concat({
                  Id: message[0],
                  Who: message[1],
                  What: message[3],
                  When: message[4],
                }).sort((m1, m2) => {
                  if (m1.When > m2.When) {
                    return 1;
                  } else if (m1.When < m2.When) {
                    return -1;
                  } else {
                    return 0;
                  }
                })
              })
            })
          }
      })
  }

  render() {
    return (
      <div className="App">
        <ChatHistory history={ this.state.history } getHistory={ this.getHistory }/>
        <ChatInput userAddress={ this.state.userAddress } sendMessage={ this.sendMessage } />
      </div>
    );
  }
}

export default App
