import React from 'react'
import PropTypes from 'prop-types'

import './ChatInput.styl'

export default class ChatInput extends React.Component {
  onSubmit(e) {
    e.preventDefault()

    const message = this.refs.txtMessage.value
    if (message.length === 0) {
      return
    }

    const msgObj = {
      Who: this.props.userAddress,
      What: message,
      When: new Date().valueOf()
    }

    this.props.sendMessage(msgObj)
    this.refs.txtMessage.value = ""
    this.refs.txtMessage.focus()
  }

  componentDidMount() {
    this.refs.txtMessage.value = ""
  }

  render() {
      const imgURL = "//robohash.org/" + this.props.userAddress + "?set=set2&bgset=bg2&size=70x70"

      return (
        <footer className="teal">
          <form className="container" onSubmit={ this.onSubmit.bind(this) }>
            <div className="row">
              <div className="input-field col s10">
                <i className="prefix material-icons">chat</i>
                <input ref="txtMessage" type="text" placeholder="Type your message" />
                <span className="chip left">
                  <img src={ imgURL } />
                  <span>Anonymous robot #{ this.props.userAddress }</span>
                </span>
              </div>
              <div className="input-field col s2">
                <button type="submit" className="waves-effect waves-light btn-floating btn-large">
                  <i className="material-icons">send</i>
                </button>
              </div>
            </div>
          </form>
        </footer>
      )
  }
}

ChatInput.propTypes = {
  userAddress: PropTypes.string,
  sendMessage: PropTypes.func,
}
