import React from 'react';
import "./messageWithPage.css";
import NavBar from "../../NavBar/NavBar"
import Footer from "../../Footer/Footer";
import FriendList from "../../FriendList/FriendList";
import Suggested from "../../Suggested/Suggested";
import MessageWith from "../../MessagesWith/MessagesWith"
import Adv from "../../Adv/Adv"; 
import { useSelector } from 'react-redux';


const MessagePageWith = () => {
    const {userId}=useSelector((state)=>{
        return{
            userId:state.user.userId
     }
    });
    return (
        <>
        <NavBar/>
            MessageWithPage
        <FriendList id={userId}/>
        <Suggested/>
        <MessageWith/>
        <Adv/>
        <Footer/>
        </>
    );
};

export default MessagePageWith;