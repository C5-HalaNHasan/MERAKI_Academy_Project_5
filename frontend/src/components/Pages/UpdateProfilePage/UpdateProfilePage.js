import React from 'react';
import "./updateProfilePage.css";
import NavBar from "../../NavBar/NavBar"
import Footer from "../../Footer/Footer";
import FriendList from "../../FriendList/FriendList";
import UserInfo from "../../UserInfo/UserInfo";
import ProfileImgs from "../../ProfileImgs/ProfileImgs";
import UpdateProfile from "../../UpdateProfile/UpdateProfile";
import Adv from "../../Adv/Adv";

const UpdateProfilePage = () => {
    return (
        <div>
        <NavBar/>
            UpdateProfile
        <FriendList/>
        <UserInfo/>
        <ProfileImgs/>
        <UpdateProfile/>
        <Adv/>
        <Footer/>
        </div>
    );
};

export default UpdateProfilePage;