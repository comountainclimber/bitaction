import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import openSocket from 'socket.io-client';

import {DefaultButton} from '../common/Button'
import AddressDetails from './AddressDetails';
import SearchBar from '../common/SearchBar';
import ContentContainer, {Busy} from '../common/ContentContainer';

import ExchangePriceData from '../common/ExchangePriceData';


export default class AddressContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      addresses: [],
      recentTransactions: [],
      pendingTransactions: [],
      recentTransactionsPaused: false
    };
    this.handleSearchForAddress = this.handleSearchForAddress.bind(this);
    this.handleUpdateSearchValue = this.handleUpdateSearchValue.bind(this);
    this.handleTempPendingTransactionMessage = this.handleTempPendingTransactionMessage.bind(this);
  }

  componentDidMount() {
    this.socket = openSocket(this.props.config.webSocketUrl);

    this.socket.on('connect', () => {
      this.socket.emit('subscribe', 'inv');
    });

    this.socket.on('tx', (data) => {
      const reduced = {
        txid: data.txid,
        valueOut: data.valueOut
      };
      if (!this.state.recentTransactionsPaused) {
        if (this.state.recentTransactions.length < 10) {
          const transactions = update(this.state.recentTransactions, {
            $unshift: [reduced]
          });
          this.setState({recentTransactions: transactions});
        } else {
          const sliced = this.state.recentTransactions.slice(0, this.state.recentTransactions.length-1);
          //sliced.u(data);
          const transactions = update(sliced, {
            $unshift: [reduced]
          });
          this.setState({recentTransactions: transactions});
        }
      }
      this.state.addresses.forEach((address) => {
        data.vout.forEach((voutTransaction) => {
          if (Object.keys(voutTransaction)[0] === address.id) {
            this.handleTempPendingTransactionMessage(
              `Address ${address.id} has a incoming unconfirmed transaction.`
            );
            const filtered = this.state.addresses.filter(
              _address => _address.id !== address.id
            );
            const addressWithPendingTrans = this.state.addresses.find(
              _address => _address.id === address.id
            );
            const newAddressList = update(filtered, {
              $push: [{
                ...addressWithPendingTrans,
                pendingTransactions: [data, ...addressWithPendingTrans.pendingTransactions]
              }]
            });
            this.setState({addresses: newAddressList});
          }
        });
      });
    });

    this.socket.on('block', (data) => {
      //TODO: deal with this

      //000000004e8d39cdf3cc35c4f325242f45d231ab88c4c2b662a13a36ab792c37

      console.log('RECEIVED A BLOCK!', data)
      // this.state.addresses.forEach((address) => {
      //   data.tx.forEach((transaction) => {
      //     // this means we have received a block with a transaction id tied to our local wallet
      //     if (address.pendingTransactions.find(pendingTx => pendingTx.txid === transaction)) {
      //       this.setState({busy: true});
      //       fetch(`${this.props.config.dataSource}/txs/?address=${address.id}`)
      //         .then(response => response.json())
      //         .then((result) => {
      //           const filtered = this.state.addresses.filter(
      //             _address => _address.id !== address.id
      //           );
      //           const newAddressList = update(filtered, {
      //             $push: [{id: address, result, pendingTransactions: []}]
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

  handleTempPendingTransactionMessage(message) {
    this.setState({pendingConfirmationMessage: message})
    setTimeout(() => this.setState({pendingConfirmationMessage: ''}), 10000);
  }

  componentWillUnmount() {
    this.socket.close();
  }

  handleSearchForAddress() {
    this.setState({busy: true});
    const address = this.state.searchValue;
    const split = address.split(',');


    if (split.length) {
      // // console.log('seperated by commas!')
      // const requests = split.map((address) => {
      //   return fetch(`${this.props.config.dataSource}/txs/?address=${address}`)
      // })
      return Promise.all(split.map((splitAddress) => {
        const addressWithoutWhiteSpace = splitAddress.trim();
        return new Promise((resolve, reject) => {
          fetch(`${this.props.config.dataSource}/txs/?address=${addressWithoutWhiteSpace}`)
            .then(response => response.json())
            .then((result) => {
              const mapped = {id: addressWithoutWhiteSpace, pendingTransactions: [], result};
              return resolve(mapped);
              // const newAddressList = update(this.state.addresses, {
              //   $push: [{id: address, pendingTransactions: [], result}]
              // });
              // this.setState({busy: false, addresses: newAddressList});
            })
            .catch((err) => {
              return reject(err);
            });
        });
      }))
        .then((results) => {
          console.log('found em ', results);
          const newAddressList = update(this.state.addresses, {
            $push: [...results]
          });
          this.setState({busy: false, addresses: newAddressList});
        })
        .catch((err) => {
          console.error(err);
          this.setState({busy: false, error: true});
        });
    } else {
    // TODO: parse the comma seperated list if it exists
      fetch(`${this.props.config.dataSource}/txs/?address=${address}`)
        .then(response => response.json())
        .then((result) => {
          const newAddressList = update(this.state.addresses, {
            $push: [{id: address, pendingTransactions: [], result}]
          });
          this.setState({busy: false, addresses: newAddressList});
        })
        .catch((err) => {
          this.setState({busy: false, error: true});
          console.error(err);
        });
    }
  }

  handleUpdateSearchValue(value) {
    return this.setState({searchValue: value, error: false})
  }

  render() {
    const {config} = this.props;
    const {addresses} = this.state;
    return (
      <div>
        <ContentContainer>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <h1 style={{marginTop: 0, marginBottom: 15}}> {config.display} </h1>
            {this.state.busy &&
              <Busy style={{fontSize: 14, fontWeight: '300', marginLeft: 15}} />
            }
            {this.state.error && <UnknownAddress />}
            {this.state.pendingConfirmationMessage &&
              <Pending message={this.state.pendingConfirmationMessage} />
            }
          </div>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <div style={{flex: 0.45, display: 'flex'}} >
              <AddressSearchContainer
                handleUpdateSearchValue={this.handleUpdateSearchValue}
                searchValue={this.state.searchValue}
                handleSearch={this.handleSearchForAddress}
              />
            </div>
            <div style={{flex: 0.45, display: 'flex', flexDirection: 'row', overflowY: 'auto'}}>
              <div style={{maxHeight: 100, display: 'flex'}}>
                <RecentTransactions transactions={this.state.recentTransactions}  />
              </div>
              {!!this.state.recentTransactions.length && (
                <div>
                  {!this.state.recentTransactionsPaused &&
                    <DefaultButton text="||" additionalStyles={{width: 50}} onClick={() => this.setState({recentTransactionsPaused: true})} />
                  }
                  {this.state.recentTransactionsPaused &&
                    <DefaultButton text="▶" additionalStyles={{width: 50}} onClick={() => this.setState({recentTransactionsPaused: false})} />
                  }
                </div>
              )}
            </div>
          </div>
          {addresses.map(
            address => (
              <AddressDetails
                // btcValue={state.data.price}
                key={address.id}
                {...address}
              />
          ))}
          {!addresses.length && <h3 style={{textAlign: 'center', marginTop: 50}}> Enter a public key to get started... </h3>}
        </ContentContainer>
      </div>
    );
  }
}

class AddressSearchContainer extends PureComponent {
  render() {
    return (
      <div style={{border: 'solid thin black', borderRadius: 5, padding: 15, width: '100%', height: 90}}>
        <div style={{marginBottom: 5}}>
          Enter address or multiple addresses seperated by commas:
        </div>
        <SearchBar
          value={this.props.searchValue}
          handleSearch={this.props.handleSearch}
          handleUpdateSearchValue={value => this.props.handleUpdateSearchValue(value)}
          placeholder="mqa4FQhmBHEGwyExG9HdtnJfkeFe3rkkkP"
        />
      </div>
    );
  }
}

const RecentTransactions = props => (
  !!props.transactions.length && (
    <div style={{fontSize: 10}}>
      {props.transactions.map((tx) => (
        <div style={{display: 'flex', flexDirection: 'column', margin: 5}}>
          <div style={{display: 'flex', flex: .6}}>
            TRANSACTION ID: {tx.txid}
          </div>
          <div style={{display: 'flex', flex: .4}}>
            VALUE OUT: {tx.valueOut}
          </div>
        </div>
      ))}
    </div>
  )
);

const UnknownAddress = props => (
  <div style={{fontSize: 14, fontWeight: '300', marginLeft: 15, color: '#F44336'}}>
    An error occurred please check the correct address was entered.
  </div>
);

const Pending = props => (
  <div style={{fontSize: 14, fontWeight: '300', marginLeft: 15, color: 'green'}}>
    {props.message}
  </div>
);

