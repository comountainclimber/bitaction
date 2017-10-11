import React, {Component} from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import openSocket from 'socket.io-client';


import AddressDetails from './AddressDetails';
import SearchBar from '../common/SearchBar';
import ContentContainer, {Busy} from '../common/ContentContainer';

import ExchangePriceSocket from '../../ExchangePriceSocket';


export default class AddressContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      addresses: [],
    };
    this.handleSearchForAddress = this.handleSearchForAddress.bind(this);
  }

  // TODO: remove this
  componentDidMount() {
    this.socket = openSocket(this.props.config.webSocketUrl);
    this.socket.on('connect', () => {
      this.socket.emit('subscribe', 'inv');
    });
    this.socket.on('tx', (data) => {
      console.log("New transaction received: " + JSON.stringify(data));
      this.state.addresses.forEach((address) => {
        data.vout.forEach((voutTransaction) => {
          console.log(Object.keys(voutTransaction)[0])
          if (Object.keys(voutTransaction)[0] === address.id) {
            console.log('WE HAVE RECEIVED A TRANSACTION TO AN ADDRESS IN STATE')
            // find wallet in addresses and 
          }
        });
      });
    });
    this.socket.on('block', (data) => {
      console.log("New block received: " + JSON.stringify(data));
      // this.state.addresses.forEach((address) => {
      //   data.vout.forEach((voutTransaction) => {
      //     if (Object.keys(voutTransaction)[0] === address.id) {
      //       this.setState({busy: true});
      //       fetch(`${this.props.config.dataSource}/txs/?address=${address.id}`)
      //         .then(response => response.json())
      //         .then((result) => {
      //           const filtered = this.state.addresses.filter(_address => _address.id !== address.id);
      //           const newAddressList = update(filtered, {
      //             $push: [{id: address, result}]
      //           });
      //           this.setState({busy: false, addresses: newAddressList});
      //         })
      //         .catch((err) => {
      //           this.setState({busy: false, error: true});
      //           console.error(err);
      //         });
      //     }
      //   });
      // });
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  handleSearchForAddress() {
    this.setState({busy: true});
    const address = this.state.searchValue;
    // TODO: parse the comma seperated list if it exists
    fetch(`${this.props.config.dataSource}/txs/?address=${address}`)
      .then(response => response.json())
      .then((result) => {
        const newAddressList = update(this.state.addresses, {
          $push: [{id: address, result}]
        });
        this.setState({busy: false, addresses: newAddressList});
      })
      .catch((err) => {
        this.setState({busy: false, error: true});
        console.error(err);
      });
  }

  render() {
    const {config} = this.props;
    const {addresses} = this.state;
    return (
      <div>
        <ContentContainer>
          <ExchangePriceSocket render={state => console.log(state)} />
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <h1 style={{marginTop: 0, marginBottom: 15}}> {config.display} </h1>
            {this.state.busy && <Busy style={{fontSize: 14, fontWeight: '300', marginLeft: 15}} />}
            {this.state.error && <UnknownAddress />}
          </div>
          <AddressSearchContainer
            handleUpdateSearchValue={value => this.setState({searchValue: value, error: false})}
            searchValue={this.state.searchValue}
            handleSearch={this.handleSearchForAddress}
          />
          {addresses.map(address => <AddressDetails key={address.id} {...address} />)}
        </ContentContainer>
      </div>
    );
  }
}

const AddressSearchContainer = props => (
  <div style={{border: 'solid thin black', borderRadius: 5, padding: 15, maxWidth: 900}}>
    <div style={{marginBottom: 5}}>
      Enter address or multiple addresses seperated by commas:
    </div>
    <SearchBar
      value={props.searchValue}
      handleSearch={props.handleSearch}
      handleUpdateSearchValue={value => props.handleUpdateSearchValue(value)}
      placeholder="mqa4FQhmBHEGwyExG9HdtnJfkeFe3rkkkP"
    />
  </div>
);

const UnknownAddress = props => (
  <div style={{fontSize: 14, fontWeight: '300', marginLeft: 15, color: '#F44336'}}>
    An error occurred please check the correct address was entered.
  </div>
);
