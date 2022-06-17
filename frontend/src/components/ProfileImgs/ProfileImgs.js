import React, { useEffect, useState } from "react";
import "./profileImgs.css";
import { useSelector, useDispatch } from "react-redux";
import { setModalBox } from "../redux/reducers/modalBox/index";
import { setCurrentUserInfo, setVisitedUserInfo } from "../redux/reducers/user";
import axios from "axios";

const ProfileImgs = ({ id }) => {
  const dispatch = useDispatch();
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
    let getUserByIdUrl = `http://localhost:5000/user/${id}`;
    axios
      .get(getUserByIdUrl, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.success == true) {
          if (result.data.result[0].id == userId) {
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

  //to use & set modalBox states:
  const {
    modalId,
    modalType,
    modalMessage,
    modalDetails,
    modalShow,
  } = useSelector((state) => {
    return {
      modalId: state.modalBox.modalId,
      modalType: state.modalBox.modalType,
      modalMessage: state.modalBox.modalMessage,
      modalDetails: state.modalBox.modalDetails,
      modalShow: state.modalBox.modalShow,
    };
  });
  const updateProfileImg = () => {
    dispatch(
      setModalBox({
        modalId: userId,
        modalType: "profileImg",
        modalMessage: "Upload Profile Photo",
        modalDetails: "",
        modalShow: true,
      })
    );
  };
  const updateCoverImg = () => {
    dispatch(
      setModalBox({
        modalId: userId,
        modalType: "coverImg",
        modalMessage: "Upload Cover Photo",
        modalDetails: "",
        modalShow: true,
      })
    );
  };

  useEffect(() => {
    getUserInfo();
  }, [id]);
  return (
    <div className="profileImgsComponent">
      <div className="imgContainer">
        <div className="coverImg">
          {id == userId ? (
            <img
              src={currentUserInfo.coverImg}
              onClick={() => updateCoverImg()}
            />
          ) : (
            <img src={visitedUserInfo.coverImg} />
          )}
        </div>
        <div className="profileImg">
          {id == userId ? (
            <img
              src={currentUserInfo.profileImg}
              onClick={() => updateProfileImg()}
            />
          ) : (
            <img src={visitedUserInfo.profileImg} />
          )}
        </div>
        <div className="profileName">
          {id == userId ? (
            <h3>
              {currentUserInfo.firstName + " " + currentUserInfo.lastName}
            </h3>
          ) : (
            <h3>
              {visitedUserInfo.firstName + " " + visitedUserInfo.lastName}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileImgs;
