import React from 'react';
import "./updateProfilePage.css";
import NavBar from "../../NavBar/NavBar"
import Footer from "../../Footer/Footer";
import FriendList from "../../FriendList/FriendList";
import UserInfo from "../../UserInfo/UserInfo";
import ProfileImgs from "../../ProfileImgs/ProfileImgs";
import UpdateProfile from "../../UpdateProfile/UpdateProfile";
import Adv from "../../Adv/Adv";
import { useSelector } from 'react-redux';


const UpdateProfilePage = () => {
    const {userId}=useSelector((state)=>{
        return{
            userId:state.user.userId
     }
    });
    return (
        <>
        <NavBar/>
            UpdateProfile
        <FriendList id={userId}/>
        <UserInfo id={userId}/>
        <ProfileImgs/>
        <UpdateProfile/>
        <Adv/>
        <Footer/>
        </>
    );
};

export default UpdateProfilePage;