import React, { useEffect, useState } from "react";
import "./profileImgs.css";
import ok from "../assets/ok.png"; //! for testing
import alert from "../assets/alert.png"; //! for testing
import { useSelector, useDispatch } from "react-redux";
import { setModalBox } from "../redux/reducers/modalBox/index";
import ModalBox from "../ModalBox/ModalBox";
import { setCurrentUserInfo, setVisitedUserInfo } from "../redux/reducers/user";
import axios from "axios";

const ProfileImgs = ({ id }) => {
  const dispatch = useDispatch();
  const [notification, setNotification] = useState("");
  //to use user token for axios calls
  const { token, userId, currentUserInfo, visitedUserInfo } = useSelector(
    (state) => {
      return {
        token: state.user.token,
        userId: state.user.userId,
        currentUserInfo: state.user.currentUserInfo,
        visitedUserInfo: state.user.visitedUserInfo,
      };
    }
  );

  //a function that will get current page user to render ProfileImgs:
  const getUserInfo = () => {
    let getUserById = `http://localhost:5000/user/friends/${id}`;
    axios
      .get(getUserById, { headers: { authorization: token } })
      .then((result) => {
        if (result.success) {
          if (id == userId) {
            dispatch(setCurrentUserInfo(result.data.result[0]));
          } else {
            dispatch(setVisitedUserInfo(result.data.result[0]));
          }
        }
      })
      .catch((error) => {
        console.log({ from_getUserInfo_ProfileImgs_error: error });
      });
  };

  //! updating profile imgs will be handelled in the modal box component:
  //to use & set modalBox states:
  const { user, type, message, details, show } = useSelector((state) => {
    return {
      user: state.modalBox.user,
      type: state.modalBox.type,
      message: state.modalBox.message,
      details: state.modalBox.details,
      show: state.modalBox.show,
    };
  });
  const updateProfileImg = () => {
    dispatch(
      setModalBox({
        user: userId,
        type: "profileImg",
        message: "",
        details: "",
        show: true,
      })
    );
  };
  const updateCoverImg = () => {
    dispatch(
      setModalBox({
        user: userId,
        type: "coverImg",
        message: "",
        details: "",
        show: true,
      })
    );
  };

  useEffect(() => {}, []);
  return (
    <div className="profileImgsComponent">
      profileImgsComponent
      <div className="imgContainer">
        <div className="coverImg" onCick={() => updateCoverImg()}>
          <img src={ok} />
        </div>
        <div className="profileImg">
          <img src={alert} onCick={() => updateProfileImg()} />
        </div>
      </div>
      ;
    </div>
  );
};

export default ProfileImgs;
