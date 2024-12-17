import React, { useState } from 'react';

const loginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password})
            });
    
            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message || 'An error occurred!');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Failed to connect to server.');
        }
        
        
    };

    return (
        <form id="login-form" onSubmit={handleSubmit}>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Login</button>
          {message && <div id="response-message">{message}</div>}
        </form>
    );
}

export default loginForm;
