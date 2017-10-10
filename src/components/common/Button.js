import React from 'react';
import PropTypes from 'prop-types';

import './styles/Button.css';

const Button = props => (
  <button
    className={props.className ? props.className : 'Button-base'}
    style={props.additionalStyles}
    onClick={props.onClick}
  >
    {props.text}
  </button>
);
Button.propTypes = {
  additionalStyles: PropTypes.object,
  onClick: PropTypes.func,
  text: PropTypes.string,
  className: PropTypes.string
};

export const DefaultButton = props => (
  <Button {...props} />
);

export const PrimaryButton = props => (
  <Button
    {...props}
    additionalStyles={{
      ...props.additionalStyles,
    }}
    className="Button-primary"
  />
);
PrimaryButton.propTypes = {
  additionalStyles: PropTypes.object
};
