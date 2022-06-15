import React from "react";
import "./messageWithPage.css";
import NavBar from "../../NavBar/NavBar";
import FriendList from "../../FriendList/FriendList";
import Suggested from "../../Suggested/Suggested";
import MessageWith from "../../MessagesWith/MessagesWith";
import Adv from "../../Adv/Adv";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ModalBox from "../../ModalBox/ModalBox";
import Banner from "../../Banner/Banner";

const MessagePageWith = () => {
  const { roomId, id } = useParams();
  const { userId } = useSelector((state) => {
    return {
      userId: state.user.userId,
    };
  });
  return (
    <>
      <ModalBox />
      <NavBar />
      <Banner />
      <FriendList id={userId} />
      <Suggested />
      <MessageWith id={id} roomId={roomId} />
      <Adv />
    </>
  );
};

export default MessagePageWith;
