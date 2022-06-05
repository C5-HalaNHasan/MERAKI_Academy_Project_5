import React from 'react';
import "./messagePage.css";
import NavBar from "../../NavBar/NavBar"
import Footer from "../../Footer/Footer";
import FriendList from "../../FriendList/FriendList";
import Suggested from "../../Suggested/Suggested";
import Messages from "../../Messages/Messages"
import Adv from "../../Adv/Adv"; 
import { useSelector } from 'react-redux';



const MessagePage = () => {
    const {userId}=useSelector((state)=>{
        return{
            userId:state.user.userId
        }
    });
    return (
        <>
        <NavBar/>
            MessagePage
        <FriendList id={userId}/>
        <Suggested/>
        <Messages/>
        <Adv/>
        <Footer/>
        </>
    );
};

export default MessagePage;