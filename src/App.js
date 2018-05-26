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
    this.getHistory = this.getHistory.bind(this)
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

    const instance = this.state.web3.eth.contract(contractABI).at(contractAddress)

    instance.MessageSent({receiver: this.state.userAddress})
    .watch((err, result) => {
      console.log("Received a message.")
      this.getHistory()
    })

    instance.MessageSent({sender: this.state.userAddress})
    .watch((err, result) => {
      console.log("Your message mined.")
      this.getHistory()
    })

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
      Id: Math.floor(Math.random() * 100000000), // overwritten once mined
      Who: this.state.userAddress,
      What: message,
      When: (new Date().valueOf()) / 1000
    }
    this.setState({
      history: this.state.history.concat(msgObj)
    }, () => {
      window.scrollTo(0, document.body.scrollHeight)
    })

    // FIXME: receiver address
    this.state.contractInstance.sendMessage.sendTransaction(
      "0xe31c5b5731f3Cba04f8CF3B1C8Eb6FCbdC66f4B5",
      message,
      {from: this.state.userAddress},
      (err, result) => {}
    );
  }

  getHistory() {
    //FIXME: 本当のReceiverに切り替え
    this.state.contractInstance.getMessages("0xe31c5b5731f3Cba04f8CF3B1C8Eb6FCbdC66f4B5", {from: this.state.userAddress}, (err, messageIds) => {
        var messageCount = 0;
        for (var i=0; i < messageIds.length; i++) {
          if (messageIds[i] == 0) break;
          messageCount++;
        }

        var history = []
        for (var i=0; i < messageCount; i++) {
          this.state.contractInstance.getMessage(messageIds[i], {from: this.state.userAddress}, (err, message) => {
            history = history.concat({
                Id: message[0],
                Who: message[1],
                What: message[3],
                When: message[4],
            })

            if (history.length == messageCount) {
              this.setState({
                history: history.sort((m1, m2) => {
                  if (m1.When > m2.When) {
                    return 1;
                  } else if (m1.When < m2.When) {
                    return -1;
                  } else {
                    return 0;
                  }
                })
              }, () => {
                window.scrollTo(0, document.body.scrollHeight)
              })
            }
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
