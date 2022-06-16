import React from "react";
import { useParams } from "react-router-dom";
import "./userProfilePage.css";
import NavBar from "../../NavBar/NavBar";
import FriendList from "../../FriendList/FriendList";
import UserInfo from "../../UserInfo/UserInfo";
import ProfileImgs from "../../ProfileImgs/ProfileImgs";
import Actions from "../../Actions/Actions";
import Adv from "../../Adv/Adv";
import CreatePost from "../../CreatePost/CreatePost";
import ShowPost from "../../ShowPost/ShowPost";
import { useSelector } from "react-redux";
import ModalBox from "../../ModalBox/ModalBox";

const UserProfilePage = () => {
  //compared with the saved id in redux store to know which component to render:Actions or Adv
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
      {/* <div style={{ visibility: "hidden" }}>
        {id !== userId && <CreatePost style={{ visibility: "hidden" }} />}
      </div> */}
      {usedId == userId ? (
        <>
          <ShowPost id={usedId} />
        </>
      ) : (
        <div style={{ alignSelf: "start" }}>
          <ShowPost id={usedId} />
        </div>
      )}
      {id == userId ? <Adv /> : <Actions id={id} />}
    </>
  );
};

export default UserProfilePage;
