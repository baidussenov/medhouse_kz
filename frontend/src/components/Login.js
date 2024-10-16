import React from 'react'

function Login() {
    const handleLogin = () => {
        window.location.href = 'http://localhost:5000/drive/auth' // Your backend Google OAuth route
    }

    return (
        <div>
            <h2>Login with Google</h2>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login
