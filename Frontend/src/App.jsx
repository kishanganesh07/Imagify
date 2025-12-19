import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home'
import Result from './pages/Result'
// import BuyCredit from './pages/BuyCredit'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Login from './Components/Login'
import { useContext } from 'react'
import AppContextProvider, { AppContext } from './context/AppContext'

const AppContent = () => {
  const {showLogin}=useContext(AppContext)
  return (
      <div className='px-4 sm:px-10 md:px-14 lg-px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50 '>
       <ToastContainer position='top-right'/>
        <Navbar/>
        {showLogin && <Login/>}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
          {/* <Route path="/buy" element={<BuyCredit />} /> */}
        </Routes>
        <Footer/>
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
