import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './styles/SearchBar.css';

class SearchBar extends Component {
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
SearchBar.propTypes = {
  handleUpdateSearchValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
  input: PropTypes.string
};

export default SearchBar;
