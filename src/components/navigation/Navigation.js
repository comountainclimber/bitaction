import React, { Component } from 'react';
import bitcoinIcon from '../../images/bitcoin-icon.png';

import './styles/Navigation.css';
import ExchangePriceData from '../../ExchangePriceData';


export default class Navigation extends Component {
  render() {
    return (
      <div className="Navigation">
        <header className="Navigation-header">
          <img src={bitcoinIcon} className="Navigation-logo" alt="logo" onClick={this.props.handleClick}/>
          <h1 className="Navigation-title">
            bitAction.io
          </h1>
          <p style={{fontWeight: '300', margin: 0}}>
            View wallet transactions in real time on both MainNet and TestNet.
          </p>
        </header>
        <ExchangePriceData render={(state) => <div> {JSON.stringify(state)} </div>} />
      </div>
    );
  }
}
