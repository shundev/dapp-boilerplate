import React from 'react'
import PropTypes from 'prop-types'

import './ChatInput.styl'

export default class ChatInput extends React.Component {
  render() {
      const imgURL = "//robohash.org/" + this.props.userAddress + "?set=set2&bgset=bg2&size=70x70"

      return (
        <footer className="teal">
          <form className="container">
            <div className="row">
              <div className="input-field col s10">
                <i className="prefix material-icons">chat</i>
                <input type="text" placeholder="Type your message" />
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
