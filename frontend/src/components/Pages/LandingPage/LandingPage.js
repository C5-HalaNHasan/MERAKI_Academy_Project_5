import React from 'react';
import "./landingPage.css";
import NavBar from "../../NavBar/NavBar"
import Footer from "../../Footer/Footer";
import Register from "../../Register/Register";

const LandingPage = () => {
    return (
        <div className="componentsContainer">
        <NavBar/>
        LandingPage
        <Register/>
        <Footer/>
        </div>
    );
};

export default LandingPage;