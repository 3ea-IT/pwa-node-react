import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Wallet from "./components/wallet";
import SplashScreen from "./components/SplashScreen";
import GetStarted from "./components/GetStarted";
import OtpVerification from "./components/OtpVerification";
import Home from "./components/Home";
import SideMenu from "./components/SideMenu";
import ReferAndEarn from "./components/ReferAndEarn";
import "bootstrap/dist/css/bootstrap.min.css";
import InviteHistory from "./components/InviteHistory";
import Profile from "./components/Profile";
import PlayEarn from "./components/PlayEarn";
import Quiz from "./components/Quiz";
import WalletHistory from "./components/WalletHistory";
import KYC from "./components/KYC";
import ProductPage from "./components/ProductPage";
import ChatbotHome from "./components/ChatbotHome";
import ForgotPassword from "./components/ForgotPassword";
import Notifications from "./components/Notifications/Notifications";
import Loader from "./components/Loader";
import FitnessData from "./components/GoogleFit/FitnessData";
import GoogleCallback from "./components/GoogleFit/GoogleCallback";
import MedicineReminder from "./components/MedicineReminder";
import AllProducts from "./components/AllProducts";
import TicTacToe from "./components/games/TicTacToe";
import Tetris from "./components/games/Tetris";
import "./App.css";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("user_id");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleLoading = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 0); // Simulate loading time
    };

    handleLoading();
  }, [location]);

  useEffect(() => {
    const publicRoutes = [
      "/login",
      "/signup",
      "/otp-verification",
      "/forgot-password",
      "/",
      "/get-started",
    ];
    // Check if not logged in and not already on a public route to prevent loops
    if (!isLoggedIn && !publicRoutes.includes(location.pathname)) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate, location.pathname]);

  return (
    <div className="App">
      {loading && <Loader />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/all-products" element={<AllProducts />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/tictactoe" element={<TicTacToe />} />
            <Route path="/tetris" element={<Tetris />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/wallet-history" element={<WalletHistory />} />
            <Route path="/home" element={<Home />} />
            <Route path="/side-menu" element={<SideMenu />} />
            <Route path="/refer-earn" element={<ReferAndEarn />} />
            <Route path="/invite-history" element={<InviteHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/playearn" element={<PlayEarn />} />
            <Route path="/KYC" element={<KYC />} />
            <Route path="/product/:productName" element={<ProductPage />} />
            <Route path="/chatbot" element={<ChatbotHome />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/fitness-data" element={<FitnessData />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/medicine-reminder" element={<MedicineReminder />} />
          </>
        ) : (
          <>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Login />} />
          </>
        )}
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
