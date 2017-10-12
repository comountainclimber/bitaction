import React, {Component} from 'react';
import PropTypes from 'prop-types';

//   static childContextTypes = {
//     form: PropTypes.shape({
//       submit: PropTypes.func.isRequired
//     }).isRequired
//   }

//   getChildContext() {
//     return {
//       form: {
//         submit: () => {
//           if (this.props.onSubmit)
//             this.props.onSubmit()
//         }
//       }
//     }
//   }

//   render() {
//     return <div>{this.props.children}</div>
//   }
// }

// class SubmitButton extends React.Component {
//   static contextTypes = {
//     form: PropTypes.shape({
//       submit: PropTypes.func.isRequired
//     }).isRequired
//   }




export default class ExchangePriceData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
    this.fetchBitcoinPriceData = this.fetchBitcoinPriceData.bind(this);
  }

  getChildContext() {
    return ({
      exchangePriceData: this.state.data
    });
  }

  fetchBitcoinPriceData() {
    fetch('https://coincap.io/page/BTC')
      .then(response => response.json())
      .then((result) => {
        this.setState({data: result});
      });
  }

  componentDidMount() {
    this.fetchBitcoinPriceData();
    this.requestInterval = setInterval(
      () => this.fetchBitcoinPriceData(), 10000
    );
  }

  componentWillUnmount() {
    clearInterval(this.requestInterval);
  }

  render() {
    return <div>{ this.props.children }</div>
  }

}

ExchangePriceData.childContextTypes = {
  exchangePriceData: PropTypes.object
};
