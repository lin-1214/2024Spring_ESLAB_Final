import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { DataProvider } from './hooks/useData.tsx'
import { BLEProvider } from './hooks/useBLE.tsx'
import './style/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BLEProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </BLEProvider>
  </React.StrictMode>
)
