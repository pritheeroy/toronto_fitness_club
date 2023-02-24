import React from "react";
import { Link } from "react-router-dom";
import videoBg from "../assets/videoBg.mp4"

const Home = () => {
    return (
        <div className="main">
            <video src={videoBg} autoPlay loop muted />
            <div className="content">
                <p style={{ fontSize: "4em", textAlign: "center" }}>Welcome to Toronto Fitness Club!</p>
                <p style={{ fontSize: "2em", textAlign: "center" }}> Let's get started. </p>
                <br />
                {localStorage.getItem('token') ? (
                    <Link to="/studios">
                        <button className="start-btn">View our studios!</button>
                    </Link>
                ) : (
                    <Link to="/login">
                        <button className="start-btn">Start your fitness journey with us!</button>
                    </Link>
                )}

            </div>
        </div>
    )
}

export default Home