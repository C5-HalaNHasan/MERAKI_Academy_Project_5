import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentUserInfo,
  setVisitedUserInfo,
} from "../redux/reducers/user/index";
import "./userInfo.css";
import { useNavigate } from "react-router-dom";
import { setModalBox } from "../redux/reducers/modalBox/index";

const UserInfo = ({ id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, userId, visitedUserInfo, currentUserInfo } = useSelector(
    (state) => {
      return {
        token: state.user.token,
        userId: state.user.userId,
        visitedUserInfo: state.user.visitedUserInfo,
        currentUserInfo: state.user.currentUserInfo,
      };
    }
  );

  //modalBox states(modal box is going to be used to update user profile):
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
  const updateUserProfile = () => {
    dispatch(
      setModalBox({
        modalId: "",
        modalType: "updateProfile",
        modalMessage: "Update Profile Info",
        modalDetails: "",
        modalShow: true,
      })
    );
  };
  useEffect(() => {
    axios
      .get(`http://localhost:5000/user/${id}`, {
        headers: { authorization: token },
      })
      .then((respon) => {
        let result = respon.data.result[0];
        result.birthday = result.birthday.split("T")[0];
        if (result.gender === 0) {
          result.gender = "male";
        }
        if (id === userId) {
          dispatch(setCurrentUserInfo(result));
        } else {
          dispatch(setVisitedUserInfo(result));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //since this component will be shown in profile pages only: id is taken from userProfile Params
  //if id=userId: dispatch(setCurrentUserInfo({getUserById from backend}))
  //if id!=userId: disptch(setVisitedUserInfo({getUserById from backend}))
  return (
    <div className="userInfoComponent">
      <div className="userInfo">
        <div className="boxTitle">
          <h3>User Info</h3>
        </div>
        <div className="userInfoContents">
          {id === userId ? (
            <>
              <div className="currentUser">
                <h4>
                  {"Name: " +
                    currentUserInfo.firstName +
                    " " +
                    currentUserInfo.lastName}
                </h4>
                <h4> {"Country: " + currentUserInfo.country}</h4>
                {currentUserInfo.birthday ? (
                  <h4>
                    {"Birthday: " + currentUserInfo.birthday.split("T")[0]}
                  </h4>
                ) : null}
                {+currentUserInfo.gender === 0 ? (
                  <h4>Gender: Male</h4>
                ) : (
                  <h4>Gender: Female</h4>
                )}
              </div>
              <div className="userInfoButton">
                <button
                  onClick={() => {
                    updateUserProfile();
                  }}
                >
                  update
                </button>
              </div>
            </>
          ) : (
            <div className="currentUser">
              <h4>
                {"Name: " +
                  visitedUserInfo.firstName +
                  " " +
                  visitedUserInfo.lastName}
              </h4>
              <h4>{"Country: " + visitedUserInfo.country}</h4>
              {visitedUserInfo.birthday ? (
                <h4>{"Birthday: " + visitedUserInfo.birthday.split("T")[0]}</h4>
              ) : (
                ""
              )}
              {visitedUserInfo.gender === 0 ? (
                <h4>Gender: Male</h4>
              ) : (
                <h4>Gender: Female</h4>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
