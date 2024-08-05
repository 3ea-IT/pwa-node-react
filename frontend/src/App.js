import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Wallet from './components/wallet';
import SplashScreen from './components/SplashScreen'; 
import GetStarted from './components/GetStarted';
import OtpVerification from './components/OtpVerification';
import Home from './components/Home';
import SideMenu from './components/SideMenu';
import ReferAndEarn from './components/ReferAndEarn';
import 'bootstrap/dist/css/bootstrap.min.css';
import InviteHistory from './components/InviteHistory';
import Profile from './components/Profile';
import PlayEarn from './components/PlayEarn';
import Quiz from './components/Quiz';
import WalletHistory from './components/WalletHistory';
import KYC from './components/KYC';
import './App.css';
import ProductPage from './components/ProductPage';

function App() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOffline) {
        return (
            <div className="offline-container">
                <h1>You are offline</h1>
                <p>Please check your internet connection and try again.</p>
            </div>
        );
    }

    return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<SplashScreen />} />
                  <Route path="/get-started" element={<GetStarted />} />    
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/otp-verification" element={<OtpVerification />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/wallet-history" element={<WalletHistory />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/side-menu" element={<SideMenu />} />
                  <Route path='/refer-earn' element={ <ReferAndEarn/>} />
                  <Route path='/invite-history' element={ <InviteHistory/>} />
                  <Route path='/profile' element={ <Profile/>} />
                  <Route path="/playearn" element={<PlayEarn />} />
                  <Route path="/KYC" element={<KYC />} />
                  <Route path="/product/:productName" element={<ProductPage />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
