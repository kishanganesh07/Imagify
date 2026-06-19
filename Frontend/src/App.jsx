import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Home from './pages/Home'
import StudioMenu from './pages/StudioMenu'
import TextToImage from './pages/TextToImage'
import ImageToImage from './pages/ImageToImage'
import BackgroundRemoval from './pages/BackgroundRemoval'
import Upscaling from './pages/Upscaling'
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
import ProtectedRoute from './Components/ProtectedRoute'
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
          <Route path="/studio" element={<ProtectedRoute><StudioMenu /></ProtectedRoute>} />
          <Route path="/studio/text-to-image" element={<ProtectedRoute><TextToImage /></ProtectedRoute>} />
          <Route path="/studio/image-to-image" element={<ProtectedRoute><ImageToImage /></ProtectedRoute>} />
          <Route path="/studio/remove-bg" element={<ProtectedRoute><BackgroundRemoval /></ProtectedRoute>} />
          <Route path="/studio/upscale" element={<ProtectedRoute><Upscaling /></ProtectedRoute>} />
          <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
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
