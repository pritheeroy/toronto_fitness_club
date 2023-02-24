import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

const User = () => {
    const [user, setUser] = useState([])

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [avatar, setAvatar] = useState(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('phone_num', phone);
    formData.append('avatar', avatar);

    const handleSubmit = (e) => {
        const url = 'http://127.0.0.1:8000/accounts/edit/'
        axios.patch(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then((res) => {
            console.log(res);
        })
        e.preventDefault();
        window.location.reload();
    }

    const handleFileSelect = (event) => {
        setAvatar(event.target.files[0]);
    };

    useEffect(() => {
        fetch("http://127.0.0.1:8000/accounts/details/", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json()
                .then(json => setUser(json)))
            .catch(error => console.log(error))
    }, [])


    return (
        <div>
            <h1 className='text-capitalize'><b>Hello, {user.first_name}!</b></h1>
            <Card style={{ width: '85%', margin: 'auto' }}>
                <Card.Body>
                    <Card.Text><b>First name: </b>{user.first_name}</Card.Text>
                    <Card.Text><b>Last name: </b>{user.last_name}</Card.Text>
                    <Card.Text><b>Email: </b>{user.email}</Card.Text>
                    <Card.Text><b>Phone number: </b>{user.phone_num}</Card.Text>
                    {user.avatar}
                </Card.Body>
            </Card>

            <hr />
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={handleSubmit}>
                        <h3>Edit Your Information</h3>
                        <div className="mb-3">
                            <label>First name</label>
                            <input
                                type="text" value={firstName} className="form-control" placeholder={user.first_name} onChange={(e) => setFirstName(e.target.value)} id="firstname" name="firstname" />
                        </div>

                        <div className="mb-3">
                            <label>Last name</label>
                            <input type="text" value={lastName} className="form-control" placeholder={user.last_name} onChange={(e) => setLastName(e.target.value)} id="lastname" name="lastname" />
                        </div>

                        <div className="mb-3">
                            <label>Email address</label>
                            <input type="email" value={email} className="form-control" placeholder={user.email} onChange={(e) => setEmail(e.target.value)} id="email" name="email" />
                        </div>

                        <div className="mb-3">
                            <label>Phone number</label>
                            <input type="text" value={phone} className="form-control" placeholder={user.phone_num} onChange={(e) => setPhone(e.target.value)} id="phone" name="phone" />
                        </div>

                        <div className="mb-3">
                            <label>Avatar</label>
                            <br />
                            <div>
                                <input
                                    type="file"
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary"> Update </button>
                        </div>
                    </form >
                </div>
            </div>
        </div>
    );
};

export default User;