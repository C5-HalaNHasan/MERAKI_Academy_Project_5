import React from 'react';
import {useParams} from "react-router-dom";
import "./userProfilePage.css";
import NavBar from "../../NavBar/NavBar"
import Footer from "../../Footer/Footer";
import FriendList from "../../FriendList/FriendList";
import UserInfo from "../../UserInfo/UserInfo";
import ProfileImgs from "../../ProfileImgs/ProfileImgs";
import Actions from "../../Actions/Actions"; //! if in others profile
import Adv from "../../Adv/Adv"; //! if in his profile
import CreatePost from "../../CreatePost/CreatePost";
import ShowPost from "../../ShowPost/ShowPost";


const UserProfilePage = () => {
    //! and compared with the saved id in redux store to know which component to render:Actions or Adv
    const {id}=useParams(); 
    return (
        <div className="componentsContainer">
        <NavBar/>
            UserProfile
        <FriendList/>
        <UserInfo/>
        <ProfileImgs/>
        <CreatePost/>
        <ShowPost type="userProfile"/>
        <Actions/>
        <Footer/>
        </div>
    );
};

export default UserProfilePage;