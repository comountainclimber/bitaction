import React from 'react';
import PropTypes from 'prop-types';

import ContentContainer from '../common/ContentContainer';
import {PrimaryButton} from '../common/Button';
import {API_CONFIG} from '../../config';

const Home = props => (
  <ContentContainer>
    <p className="App-intro">
      Choose a Bitcoin blockchain below:
    </p>
    <BlockChainOptions history={props.history} />
  </ContentContainer>
);
Home.propTypes = {
  history: PropTypes.object.isRequired
};

const BlockChainOptions = ({history}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 30}}>
    <PrimaryButton
      text={API_CONFIG.TEST_NET.display}
      onClick={() => history.push(API_CONFIG.TEST_NET.internalUrl)}
      additionalStyles={{marginBottom: 25}}
    />
    <PrimaryButton
      text={API_CONFIG.MAIN_NET.display}
      onClick={() => history.push(API_CONFIG.MAIN_NET.internalUrl)}
    />
  </div>
);
BlockChainOptions.propTypes = {
  history: PropTypes.object.isRequired
};

export default Home;
