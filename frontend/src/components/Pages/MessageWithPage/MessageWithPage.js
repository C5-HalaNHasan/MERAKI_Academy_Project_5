import React from 'react';
import "./messageWithPage.css";
import NavBar from "../../NavBar/NavBar"
import Footer from "../../Footer/Footer";
import FriendList from "../../FriendList/FriendList";
import Suggested from "../../Suggested/Suggested";
import MessageWith from "../../MessagesWith/MessagesWith"
import Adv from "../../Adv/Adv"; 

const MessagePageWith = () => {
    return (
        <div className="componentsContainer">
        <NavBar/>
            MessageWithPage
        <FriendList/>
        <Suggested/>
        <MessageWith/>
        <Adv/>
        <Footer/>
        </div>
    );
};

export default MessagePageWith;