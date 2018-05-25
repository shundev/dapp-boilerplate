import React from 'react'
import PropTypes from 'prop-types'

import './ChatHistory.styl'

export default class ChatHistory extends React.Component {
  render() {
    return (
      <ul className="collection">
      {
        this.props.history.map((msgObj) => {
          const imgURL = "//robohash.org/" + msgObj.Who + "?set=set2&bgset=bg2&size=70x70";
          return (
            <li className="collection-item avatar" key={ msgObj.When }>
              <img src={ imgURL } alt="{ msgObj.Who }" className="circle" />
              <span className="title">Anonymous robot #{ msgObj.Who }</span>
              <p>
                <i className="prefix tiny material-icons">alarm</i>
                <span className="message-date">{ msgObj.When }</span>
                <br />
                <span>{ msgObj.What }</span>
              </p>
            </li>
          )
        })
      }
      </ul>
    )
  }
}

class ChatHistoryItem extends React.Component {

}

ChatHistory.propTypes = {
  history: PropTypes.arrayOf(PropTypes.object),
}
