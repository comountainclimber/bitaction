import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './styles/SearchBar.css';

const propTypes = {
  handleUpdateSearchValue: PropTypes.func,
  placeholder: PropTypes.string
};
class SearchBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form
        className="SearchBar"
        onSubmit={(e) => {
          e.preventDefault();
          this.props.handleSearch();
        }}
      >
        <input
          className="glowing"
          type="text"
          value={this.props.input}
          onChange={e => this.props.handleUpdateSearchValue(e.target.value)}
          placeholder={this.props.placeholder}
        />
        <input type="submit" value="Search" />
      </form>
    );
  }
}
SearchBar.propTypes = propTypes;

export default SearchBar;
