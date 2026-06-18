import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Home from './pages/Home'
import CreativeStudio from './pages/CreativeStudio'
import Gallery from './pages/Gallery'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Favorites from './pages/Favorites'
import ErrorPage from './pages/ErrorPage'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Login from './Components/Login'
import PricingModal from './Components/PricingModal'
import ScrollToTop from './Components/ScrollToTop'
import AppContextProvider, { AppContext } from './context/AppContext'

const AppContent = () => {
  const { showLogin, showPricing, setShowPricing, theme } = useContext(AppContext)
  
  return (
      <div className={`${theme} min-h-screen transition-colors duration-300`} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <ScrollToTop />
        <ToastContainer position='top-right' theme={theme === 'dark' ? 'dark' : 'light'} />
        <Navbar />
        {showLogin && <Login />}
        {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/studio" element={<CreativeStudio />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        
        <Footer />
      </div>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <AppContent />
      </AppContextProvider>
    </BrowserRouter>
  )
}

export default App
