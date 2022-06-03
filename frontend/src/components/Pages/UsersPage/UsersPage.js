import React from 'react';
import {useParams} from "react-router-dom";
import "./usersPage.css";
import NavBar from "../../NavBar/NavBar"
import Footer from "../../Footer/Footer";
import FriendList from "../../FriendList/FriendList";
import Suggested from "../../Suggested/Suggested";
import Users from "../../Users/Users"
import Adv from "../../Adv/Adv"; 


const UsersPage = () => {
    //to get the type of the page if search or friendlist from params:
    const {type}=useParams(); 
    return (
        <div className="componentsContainer">
        <NavBar/>
            UsersPage
        <FriendList/>
        <Suggested/>
        <Users type={type}/>
        <Adv/>
        <Footer/>
        </div>
    );
};

export default UsersPage;