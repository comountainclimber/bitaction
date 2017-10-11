export const colors = {
  darkGrey: '#222',
  lightGrey: '#e9e9e9',
  emerald: '#2ecc71',
  lightEmerald: '#b1dfbb',
  gold: '#f6b01c',
  blue: '#449CFA'
};

export const API_CONFIG = {
  TEST_NET: {
    id: 'TEST_NET',
    display: 'Testnet',
    internalUrl: '/testnet',
    webSocketUrl: 'https://testnet.blockexplorer.com/',
    dataSource: 'https://testnet.blockexplorer.com/api'
  },
  MAIN_NET: {
    id: 'MAIN_NET',
    display: 'Mainnet',
    internalUrl: '/mainnet',
    webSocketUrl: 'https://blockexplorer.com',
    dataSource: 'https://blockexplorer.com/api'
  },
};
