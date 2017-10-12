import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

import './styles/Address.css';
import {currencyFormatter} from '../../utils/utils';

const AddressDetails = (props, context) => (
  <div className="Address-card">
    <div style={{marginBottom: 5, display: 'flex', flexDirection: 'column'}}>
      <b style={{flex: 1}}>ADDRESS:</b>
      <div className="AddressDetails-qr-code-container">
        <div style={{marginBottom: 5}}>
          {props.id}
        </div>
        <QRCode value={props.id} size={100} />
      </div>
    </div>

    <PendingTransactions id={props.id} pendingTransactions={props.pendingTransactions} />

    <div style={{maxHeight: 250, overflowY: 'auto'}}>
      <b>CONFIRMED ({props.result.txs.length}) :</b>
      {!!props.result.txs.length && (
        props.result.txs.map(transaction => (
          <TransactionParser
            key={transaction.txid}
            id={props.id}
            transaction={transaction}
            btcValue={context.exchangePriceData.price}
          />
      )))}
    </div>
  </div>
);
AddressDetails.propTypes = {
  id: PropTypes.string.isRequired,
  pendingTransactions: PropTypes.array.isRequired,
  result: PropTypes.object.isRequired
};
AddressDetails.contextTypes = {
  exchangePriceData: PropTypes.object
};

const PendingTransactions = (props) => {
  const pending = [];
  props.pendingTransactions.forEach((transaction) => {
    if (transaction.vout.find(value => Object.keys(value)[0] === props.id)) {
      pending.push(<a style={{fontSize: 10}}> {transaction.txid} </a>);
    }
  });
  return (
    <div>
      {!!pending.length &&
        <div style={{marginBottom: 15}}>
          <b>PENDING ({props.pendingTransactions.length}) :</b>
          {pending}
        </div>
      }
    </div>
  );
};
PendingTransactions.propTypes = {
  pendingTransactions: PropTypes.array.isRequired
};

const TransactionParser = (props) => {
  const transactionID = props.transaction.txid;
  const debits = [];
  props.transaction.vin.forEach((transaction) => {
    if (transaction.addr === props.id) {
      debits.push(
        <div
          key={transaction.txid}
          className="AddressDetails-debit-row"
        >
          <div style={{display: 'flex'}}>
            - {transaction.value}
          </div>
          <div style={{display: 'flex'}}>
            {currencyFormatter.format(transaction.value * props.btcValue)}
          </div>
        </div>
      );
    }
  });
  const credits = [];
  props.transaction.vout.forEach((transaction) => {
    if (transaction.scriptPubKey.addresses.find(value => value === props.id)) {
      credits.push(
        <div
          key={transaction.scriptPubKey.hex}
          className="AddressDetails-credit-row"
        >
          <div style={{display: 'flex'}}>
            + {transaction.value}
          </div>
          <div style={{display: 'flex'}}>
            {currencyFormatter.format(transaction.value * props.btcValue)}
          </div>
        </div>
      );
    }
  });
  return (
    <div key={transactionID} style={{display: 'flex', flexDirection: 'column'}}>
      {debits}
      {credits}
      <a style={{fontSize: 10}} disabled> {transactionID} </a>
    </div>
  );
};
TransactionParser.propTypes = {
  transaction: PropTypes.object.isRequired,
  btcValue: PropTypes.number
};

export default AddressDetails;
