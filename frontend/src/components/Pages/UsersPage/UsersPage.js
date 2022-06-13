import React from "react";
import { useParams } from "react-router-dom";
import "./usersPage.css";
import NavBar from "../../NavBar/NavBar";
import FriendList from "../../FriendList/FriendList";
import Suggested from "../../Suggested/Suggested";
import Users from "../../Users/Users";
import Adv from "../../Adv/Adv";
import { useSelector } from "react-redux";
import ModalBox from "../../ModalBox/ModalBox";

const UsersPage = () => {
  const { userId } = useSelector((state) => {
    return {
      userId: state.user.userId,
    };
  });
  //to get the type of the page if search or friendlist and the name of the searche user from params:
  const { type, name } = useParams();
  return (
    <>
      <ModalBox />
      <NavBar />
      <FriendList id={userId} />
      <Suggested />
      <Users type={type} name={name} />
      <Adv />
    </>
  );
};

export default UsersPage;
