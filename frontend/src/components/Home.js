import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";
import SideMenu from "./SideMenu";
import profileicon from "./assets/profileicon.png";
import sun from "./assets/sun.png";
import Mascort from "./assets/Mascort.png";
import { FaBars, FaSearch, FaRegBell, FaTimes } from "react-icons/fa";
import { format } from "date-fns";

const Home = () => {
  const [userData, setUserData] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotificationLabel, setShowNotificationLabel] = useState(true);
  const [showSubscribePopup, setShowSubscribePopup] = useState(false);
  const [popularMedicines, setPopularMedicines] = useState([]); // Only recommended products

  const date = new Date();
  const navigate = useNavigate();

  // 1. Fetch only recommended products from the new endpoint
  useEffect(() => {
    const fetchRecommendedMedicines = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}recommended-products`
        );
        const data = await response.json();

        // If your backend returns the image path as "products/...",
        // you might need to prepend REACT_APP_BASE_URL:
        const products = data.map((product) => ({
          name: product.name,
          image: `${process.env.REACT_APP_BASE_URL}${product.image}`,
          brand_name: product.brand_name,
        }));

        setPopularMedicines(products);
      } catch (error) {
        console.error("Error fetching recommended medicines:", error);
      }
    };

    fetchRecommendedMedicines();
  }, []);

  //Remove or comment out any old product fetching logic you no longer need:
  // useEffect(() => {
  //   const fetchPopularMedicines = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.REACT_APP_API_URL}products`
  //       );
  //       const data = await response.json();

  //       // Assuming the API returns an array of products with name and image URL
  //       const products = data.map((product) => ({
  //         name: product.name,
  //         image: `${process.env.REACT_APP_BASE_URL}${product.image}`, // Assuming image paths are stored in the database
  //       }));

  //       setPopularMedicines(products); // Update the state with fetched data
  //     } catch (error) {
  //       console.error("Error fetching popular medicines:", error);
  //     }
  //   };

  //   fetchPopularMedicines();
  // }, []);

  const handleProfile = () => {
    navigate("/profile");
  };
  const handleNotif = () => {
    navigate("/notifications");
  };
  const handleLearnMoreClick = () => {
    navigate("/all-products");
  };

  const subscribeUser = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.REACT_APP_VAPID_PUBLIC_KEY
          ),
        });

        const userId = localStorage.getItem("user_id");
        const subscriptionData = {
          userId,
          endpoint: subscription.endpoint,
          keyId: btoa(
            String.fromCharCode.apply(
              null,
              new Uint8Array(subscription.getKey("p256dh"))
            )
          ),
          token: btoa(
            String.fromCharCode.apply(
              null,
              new Uint8Array(subscription.getKey("auth"))
            )
          ),
        };

        await fetch(`${process.env.REACT_APP_API_URL}subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscriptionData),
        });

        setShowSubscribePopup(false);
      } catch (error) {
        console.error("Failed to subscribe the user: ", error);
      }
    } else {
      console.warn("Push messaging is not supported");
    }
  };

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    // Fetch whether the user has subscribed to notifications
    fetch(`${process.env.REACT_APP_API_URL}check-subscription/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.isSubscribed) {
          setShowSubscribePopup(false); // User already subscribed, hide the popup
        } else {
          setShowSubscribePopup(true); // User not subscribed, show the popup
        }
      })
      .catch((error) =>
        console.error("Error checking subscription status:", error)
      );
  }, []);

  useEffect(() => {
    const fetchNotificationCount = () => {
      const userId = localStorage.getItem("user_id");
      if (userId) {
        fetch(`${process.env.REACT_APP_API_URL}notifications/${userId}`)
          .then((response) => response.json())
          .then((data) => {
            const unreadCount = data.length;
            setNotificationCount(unreadCount);
          })
          .catch((error) =>
            console.error("Error fetching notifications:", error)
          );
      }
    };

    fetchNotificationCount();

    if (notificationCount > 0 && showNotificationLabel) {
      const timer = setTimeout(() => {
        setShowNotificationLabel(false);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [notificationCount, showNotificationLabel]);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    fetch(`${process.env.REACT_APP_API_URL}user/${userId}`)
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  return (
    <div className="home-container">
      <div className="home-header">
        <FaBars className="menu-icon" onClick={() => setShowMenu(true)} />
        <div className="notifications">
          {notificationCount > 0 && (
            <div className="notification-badge">{notificationCount}</div>
          )}
          <FaRegBell className="bell-icon" onClick={handleNotif} />
          <img
            src={profileicon}
            alt="Profile"
            className="profile-icon"
            onClick={handleProfile}
          />
        </div>
      </div>
      {showMenu && <SideMenu closeMenu={() => setShowMenu(false)} />}
      {showNotificationLabel && notificationCount > 0 && (
        <div className="notification-label">
          <p>You have {notificationCount} unread notifications.</p>
          <FaTimes
            className="close-icon"
            onClick={() => setShowNotificationLabel(false)}
          />
          {/* <div className="notification-badge">{notificationCount}</div> */}
        </div>
      )}
      {/* {showSubscribePopup && (
        <div className="subscribe-popup">
          <p>Subscribe for latest updates</p>
          <button onClick={subscribeUser}>Allow</button>
        </div>
      )} */}
      <div className="home-content">
        <div className="date-section">
          <img src={sun} alt="Sun" className="sun-icon" />
          <div className="date">{format(date, "EEE dd MMM").toUpperCase()}</div>
        </div>
        <div className="greeting">
          <h1>Hi, {userData.name}</h1>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Migrane" />
          <FaSearch className="search-icon" />
        </div>
        <div className="mascot-section">
          <img src={Mascort} alt="Doctor Mascot" className="mascot-image" />
          <div className="mascot-text">
            <h2>
              Explore Effective Homeopathic Remedies for All Your Health
              Concerns with Dr. Haslab
            </h2>
            <button className="learn-more-btn" onClick={handleLearnMoreClick}>
              Learn More
            </button>
          </div>
        </div>
        {/* <div className="carousel-dots">
          <span className="carousel-dot active"></span>
          <span className="carousel-dot"></span>
          <span className="carousel-dot"></span>
        </div> */}
        <div className="popular-medicine-section">
          <div className="popular-medicine-header">
            <h3 className="popular-medicine-title">Recomended Medicine</h3>
          </div>
          <div className="medicine-grid">
            {popularMedicines.map((medicine, index) => (
              <div key={index} className="medicine-card">
                <div className="medicine-image-wrapper">
                  <img
                    src={medicine.image}
                    alt={medicine.name}
                    className="medicine-image"
                    onError={(e) => {
                      e.target.src = "/fallback-image.png";
                    }}
                  />
                </div>
                <div className="medicine-content">
                  <span className="brand-badge">{medicine.brand_name}</span>
                  <Link
                    to={`/product/${medicine.name}`}
                    className="medicine-link"
                  >
                    <h3 className="medicine-name">{medicine.name}</h3>
                  </Link>
                  {/* <p className="medicine-price">{medicine.price}</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
