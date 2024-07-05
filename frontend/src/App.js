import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [data, setData] = useState([]);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        axios.get('http://localhost:5000/data')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });

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
            <div className="App">
                <header className="App-header">
                    <h1>You are offline</h1>
                    <p>Please check your internet connection and try again.</p>
                </header>
            </div>
        );
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>PWA with React and Node</h1>
                <ul>
                    {data.map(item => (
                        <li key={item.id}>{item.name}: {item.value}</li>
                    ))}
                </ul>
            </header>
        </div>
    );
}

export default App;
