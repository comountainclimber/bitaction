import React, {Component} from 'react';
import cryptoSocket from 'crypto-socket';

// let exchangeData;
// export default exchangeData;

export default class ExchangePriceSocket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    setInterval(
      () => {
        this.setState({data: cryptoSocket.echoExchange()});
      }, 2000
    );
  }

  render() {
    return this.props.render(this.state);
  }

}
