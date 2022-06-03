import React from 'react';
import "./homePage.css";
import NavBar from "../../NavBar/NavBar"
import Footer from "../../Footer/Footer";
import FriendList from "../../FriendList/FriendList";
import Suggested from "../../Suggested/Suggested";
import Adv from "../../Adv/Adv";
import CreatePost from "../../CreatePost/CreatePost";
import ShowPost from "../../ShowPost/ShowPost";


const HomePage = () => {
    return (
        <>
        <NavBar/>
        <FriendList/>
        <Suggested/>
        <CreatePost/>
        <ShowPost type="homePage"/>
        <Adv/>
        <Footer/>
       
        </>
    );
};

export default HomePage;