import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AppKitProvider } from '../web3Utils/config.jsx';
import { ContractProvider } from '../web3Utils/blockchainContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppKitProvider>
      <ContractProvider>
        <App />
      </ContractProvider>
    </AppKitProvider>
  </StrictMode>
);
