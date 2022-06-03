import React from 'react';
import "./landingPage.css";
import NavBar from "../../NavBar/NavBar"
import Footer from "../../Footer/Footer";
import Register from "../../Register/Register";
import Login from '../../Login/Login';

const LandingPage = () => {
    return (
        <>
        <NavBar/>
        LandingPage
        {/* <Register/> */}
        <Login/>
        <Footer/>
        </>
    );
};

export default LandingPage;