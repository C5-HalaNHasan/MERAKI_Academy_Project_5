import React from "react";
import "./messagePage.css";
import NavBar from "../../NavBar/NavBar";
import FriendList from "../../FriendList/FriendList";
import Suggested from "../../Suggested/Suggested";
import Messages from "../../Messages/Messages";
import Adv from "../../Adv/Adv";
import { useSelector } from "react-redux";
import ModalBox from "../../ModalBox/ModalBox";

const MessagePage = () => {
  const { userId } = useSelector((state) => {
    return {
      userId: state.user.userId,
    };
  });
  return (
    <>
      <ModalBox />
      <NavBar />
      <FriendList id={userId} />
      <Suggested />
      <Messages />
      <Adv />
    </>
  );
};

export default MessagePage;
