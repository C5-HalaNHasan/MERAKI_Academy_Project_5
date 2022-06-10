import React from "react";
import { useParams } from "react-router-dom";
import "./userProfilePage.css";
import NavBar from "../../NavBar/NavBar";
import Footer from "../../Footer/Footer"; //! to be deleted
import FriendList from "../../FriendList/FriendList";
import UserInfo from "../../UserInfo/UserInfo";
import ProfileImgs from "../../ProfileImgs/ProfileImgs";
import Actions from "../../Actions/Actions"; //! if in others profile
import Adv from "../../Adv/Adv"; //! if in his profile
import CreatePost from "../../CreatePost/CreatePost";
import ShowPost from "../../ShowPost/ShowPost";
import { useSelector } from "react-redux";
import ModalBox from "../../ModalBox/ModalBox";

const UserProfilePage = () => {
  //! compared with the saved id in redux store to know which component to render:Actions or Adv
  const { id } = useParams();
  const { userId } = useSelector((state) => {
    return {
      userId: state.user.userId,
    };
  });
  const usedId = id == userId ? userId : id;
  return (
    <>
      <ModalBox />
      <NavBar />
      <FriendList id={usedId} />
      <UserInfo id={usedId} />
      <ProfileImgs id={usedId} />
      {id == userId && <CreatePost />}
      <ShowPost id={usedId} />
      {id == userId ? <Adv /> : <Actions id={id} />}
      {/* <Footer /> */}
    </>
  );
};

export default UserProfilePage;
