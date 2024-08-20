import React from 'react';

const GoogleFitLogin = () => {
    const handleLogin = () => {
        window.location.href = '/auth/google';
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Sign in with Google</button>
        </div>
    );
};

export default GoogleFitLogin;

