import React from 'react';
import "./messagePage.css";
import NavBar from "../../NavBar/NavBar"
import Footer from "../../Footer/Footer";
import FriendList from "../../FriendList/FriendList";
import Suggested from "../../Suggested/Suggested";
import Messages from "../../Messages/Messages"
import Adv from "../../Adv/Adv"; 


const MessagePage = () => {
    return (
        <div>
        <NavBar/>
            MessagePage
        <FriendList/>
        <Suggested/>
        <Messages/>
        <Adv/>
        <Footer/>
        </div>
    );
};

export default MessagePage;