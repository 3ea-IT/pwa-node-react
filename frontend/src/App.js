import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import PlayAndEarn from './components/PlayAndEarn';
import Navbar from './components/Navbar';
import Wallet from './components/Wallet';
import SplashScreen from './components/SplashScreen'; 
import GetStarted from './components/GetStarted';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

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
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/play-and-earn" element={<PlayAndEarn />} />
                  <Route path="/wallet" element={<Wallet />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
