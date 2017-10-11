import React, {Component} from 'react';

export default class ExchangePriceData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
    this.fetchBitcoinPriceData = this.fetchBitcoinPriceData.bind(this);
  }

  fetchBitcoinPriceData() {
    fetch('http://coincap.io/page/BTC')
      .then(response => response.json())
      .then((result) => {
        this.setState({data: result});
      })
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
    if (this.props.children) {
      return (
        this.props.children(this.state)
      );
    }
    this.props.render(this.state);
    return null;
  }

}
