import React, { useState, Component } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const Register = (props) => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [password2, setPassword2] = useState(null);
    const [phone, setPhone] = useState(null);

    const [avatar, setAvatar] = useState(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('password', password);
    formData.append('password2', password2);
    formData.append('phone_num', phone);
    formData.append('avatar', avatar);

    const handleSubmit = (e) => {
        const url = 'http://127.0.0.1:8000/accounts/signup/'
        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((res) => {
            console.log(res);
        })
        e.preventDefault();
        navigate('/');
    }

    const handleFileSelect = (event) => {
        setAvatar(event.target.files[0]);
    };

    return (
        <>
            <div className="auth-wrapper">
                <div className="auth-inner">


                    <form onSubmit={handleSubmit}>
                        <h3>Register</h3>
                        <div className="mb-3">
                            <label>First name</label>
                            <input
                                type="text" value={firstName} className="form-control" placeholder="First name" onChange={(e) => setFirstName(e.target.value)} id="firstname" name="firstname" required />
                        </div>

                        <div className="mb-3">
                            <label>Last name</label>
                            <input type="text" value={lastName} className="form-control" placeholder="Last name" onChange={(e) => setLastName(e.target.value)} id="lastname" name="lastname" required />
                        </div>

                        <div className="mb-3">
                            <label>Email address</label>
                            <input type="email" value={email} className="form-control" placeholder="email@email.com" onChange={(e) => setEmail(e.target.value)} id="email" name="email" required />
                        </div>

                        <div className="mb-3">
                            <label>Phone number</label>
                            <input type="text" value={phone} className="form-control" placeholder="XXX XXX XXXX" onChange={(e) => setPhone(e.target.value)} id="phone" name="phone" required />
                        </div>

                        <div className="mb-3">
                            <label>Password</label>
                            <input type="password" value={password} className="form-control" placeholder="********" onChange={(e) => setPassword(e.target.value)} id="password" name="password" required />
                        </div>

                        <div className="mb-3">
                            <label>Confirm password</label>
                            <input type="password" value={password2} className="form-control" placeholder="********" onChange={(e) => setPassword2(e.target.value)} id="password2" name="password2" required />
                        </div>

                        <div className="mb-3">
                            <label>Avatar</label>
                            <br />
                            <div>
                                <input
                                    type="file"
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                    required
                                />
                            </div>
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary"> Register </button>
                        </div>

                        <p className="forgot-password text-right">
                            Already have an account? <a href="/login">Login here!</a>
                        </p>
                    </form >
                </div>
            </div>
        </>
    );
};