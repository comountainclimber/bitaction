import React, { Component } from 'react';
import PropTypes from 'prop-types';

import bitcoinIcon from '../../images/bitcoin-icon.png';
import './styles/Navigation.css';
import {currencyFormatter} from '../../utils/utils';


export default class Navigation extends Component {
  render() {
    return (
      <div className="Navigation">
        <header className="Navigation-header">
          <img src={bitcoinIcon} className="Navigation-logo" alt="logo" onClick={this.props.handleClick}/>
          <h1 className="Navigation-title">
            bitAction.io
          </h1>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <p style={{fontWeight: '300', margin: 0}}>
              View wallet transactions in real time on both MainNet and TestNet.
            </p>
            {this.context.exchangePriceData.price &&
              <div style={{textAlign: 'right'}}>
                1 bitcoin = {currencyFormatter.format(this.context.exchangePriceData.price)}
              </div>
            }
          </div>
        </header>
      </div>
    );
  }
}

Navigation.contextTypes = {
  exchangePriceData: PropTypes.object
};

