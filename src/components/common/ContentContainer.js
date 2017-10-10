import React from 'react';
import PropTypes from 'prop-types';

import './styles/ContentContainer.css';

const ContentContainer = props => (
  <div className="ContentContainer-content">
    {props.busy && <Busy />}
    {!props.busy && props.children}
  </div>
);
ContentContainer.propTypes = {
  busy: PropTypes.bool,
  children: PropTypes.node
};

export const Busy = (props = {}) => (
  <div style={{fontSize: 25, ...props.style}}>
    Fetching your blockchain data...
  </div>
);

export default ContentContainer;
