import React, {Component} from 'react';
import PropTypes from 'prop-types';

import SearchBar from '../common/SearchBar';
import ContentContainer, {Busy} from '../common/ContentContainer';

export default class WalletContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: ''
    };
    this.handleSearchForAddress = this.handleSearchForAddress.bind(this);
  }

  handleSearchForAddress() {
    this.setState({busy: true});
    // TODO: parse the comma seperated list if it exists
    fetch(`${this.props.config.dataSource}/txs/?address=${this.state.searchValue}`)
      .then(response => response.json())
      .then((result) => {
        this.setState({busy: false});
        console.log(result);
      })
      .catch((err) => {
        this.setState({busy: false, error: true});
        console.error(err);
      });
  }

  render() {
    const {config} = this.props;
    return (
      <div>
        <div style={{padding: '0 20px 0 20px'}}>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <h1> {config.display} </h1>
            {this.state.busy && <Busy style={{fontSize: 14, fontWeight: '300', marginLeft: 25}}/>}
            {this.state.error && <UnknownAddress />}
          </div>
          <WalletContainerSearch
            handleUpdateSearchValue={value => this.setState({searchValue: value, error: false})}
            searchValue={this.state.searchValue}
            handleSearch={this.handleSearchForAddress}
          />
        </div>
        <ContentContainer>
        </ContentContainer>
      </div>
    );
  }
}

const WalletContainerSearch = props => (
  <div style={{border: 'solid thin black', borderRadius: 5, padding: 15}}>
    <div style={{marginBottom: 5}}>
      Enter wallet address or multiple addresses seperated by commas:
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
    An error occurred please check the wallet address entered.
  </div>
);
