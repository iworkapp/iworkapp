import './polyfill.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BoardProvider } from './context/BoardContext.jsx'
import './index.css'
import { AppWalletProvider } from './solana/AppWalletProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWalletProvider>
      <BoardProvider>
        <App />
      </BoardProvider>
    </AppWalletProvider>
  </StrictMode>,
)
