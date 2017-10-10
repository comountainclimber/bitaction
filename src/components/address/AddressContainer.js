import React, {Component} from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import AddressDetails from './AddressDetails';
import SearchBar from '../common/SearchBar';
import ContentContainer, {Busy} from '../common/ContentContainer';

export default class AddressContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      addresses: []
    };
    this.handleSearchForAddress = this.handleSearchForAddress.bind(this);
  }

  // TODO: remove this
  componentDidMount() {
    // this.setState({searchValue: 'muNfmyaGJMcUb4naF5iYtt3sJ5KMiXvBgv'}, () => {
    //   this.handleSearchForAddress();
    // });
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
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <h1 style={{marginTop: 0}}> {config.display} </h1>
            {this.state.busy && <Busy style={{fontSize: 14, fontWeight: '300', marginLeft: 25}}/>}
            {this.state.error && <UnknownAddress />}
          </div>
          <AddressSearchContainer
            handleUpdateSearchValue={value => this.setState({searchValue: value, error: false})}
            searchValue={this.state.searchValue}
            handleSearch={this.handleSearchForAddress}
          />
          {addresses.map(address => <AddressDetails {...address} />)}
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
  <div style={{fontSize: 14, fontWeight: '300', marginLeft: 25, color: '#F44336'}}>
    An error occurred please check the correct address was entered.
  </div>
);
