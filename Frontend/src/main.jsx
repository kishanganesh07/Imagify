import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppContextProvider from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppContextProvider>
    <App />
    </AppContextProvider>
  </React.StrictMode>
  
)
