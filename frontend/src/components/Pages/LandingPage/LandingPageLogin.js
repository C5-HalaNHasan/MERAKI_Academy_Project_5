import React from "react";
import "./landingPage.css";
import NavBar from "../../NavBar/NavBar";
import Footer from "../../Footer/Footer";
import Register from "../../Register/Register";
import Login from "../../Login/Login";
import ModalBox from "../../ModalBox/ModalBox";

const LandingPage = () => {
  return (
    <>
      <ModalBox />
      <NavBar />
      <Login />
      <Footer />
    </>
  );
};

export default LandingPage;
