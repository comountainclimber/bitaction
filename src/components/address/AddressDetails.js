import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import './styles/Address.css';

const AddressDetails = props => (
  console.log(props) ||
  <div className="Address-card">
    <div style={{marginBottom: 5, display: 'flex', flexDirection: 'column'}}>
      <b style={{flex: 1}}>ADDRESS:</b>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10, marginBottom: 10}}>
        <div style={{marginBottom: 5}}>
          {props.id}
        </div>
        <QRCode value={props.id} size={100}/>
      </div>
    </div>
    <div style={{height: 250, overflowY: 'auto'}}>
      <b>TRANSACTIONS ({props.result.txs.length}) :</b>
      {!!props.result.txs.length && (
        props.result.txs.map(transaction => (
        // a list of transactions associated with a block
        <Blockparser id={props.id} transaction={transaction} />
      )))}
    </div>
  </div>
);

const Blockparser = (props) => {
  const transactionID = props.transaction.txid;
  const debit = props.transaction.vin.map((transaction) => {
    if (transaction.addr === props.id) {
      return (<div style={{color: 'red'}}> - {transaction.value} </div>);
    }
  });
  const credit = props.transaction.vout.map((transaction) => {
    if (transaction.scriptPubKey.addresses.find(value => value === props.id)) {
      return (<div style={{color: 'green'}}> + {transaction.value} </div>);
    }
  });

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      {debit}
      {credit}
      <a style={{fontSize: 10}} disabled> {transactionID} </a>
    </div>
  );
};


export default AddressDetails;
