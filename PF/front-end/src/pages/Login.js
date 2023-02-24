import React, { useState, Component } from "react"
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const credentials = { email: `${email}`, password: `${password}` };

    const handleSubmit = (e) => {
        fetch('http://127.0.0.1:8000/accounts/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        })
            .then(data => data.json())
            .then(
                data => {
                    localStorage.setItem('token', data.access);
                }
            )
        e.preventDefault();
        navigate('/');
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={handleSubmit}>
                    <h3>Login</h3>

                    <div className="mb-3">
                        <label>Email address</label>
                        <input type="email" value={email} className="form-control" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} id="email" name="email" />
                    </div>

                    <div className="mb-3">
                        <label>Password</label>
                        <input type="password" value={password} className="form-control" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} id="password" name="password" />
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary"> Log In! </button>
                    </div>

                    <p className="forgot-password text-right">
                        Don't have an account? <a href="/register">Register here!</a>
                    </p>
                </form>
            </div>
        </div>
    )
}