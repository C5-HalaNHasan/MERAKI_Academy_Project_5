import React, { useEffect, useState } from "react";
import "./profileImgs.css";
import { useSelector, useDispatch } from "react-redux";
import { setModalBox } from "../redux/reducers/modalBox/index";
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
    let getUserByIdUrl = `http://localhost:5000/user/${id}`;
    console.log({ problemId: getUserByIdUrl }); //!
    axios
      .get(getUserByIdUrl, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.success == true) {
          if (result.data.result[0].id == userId) {
            console.log({ currentUserFromImgsComponent: currentUserInfo }); //!
            dispatch(setCurrentUserInfo(result.data.result[0]));
          } else {
            console.log({ visitedUserInfo: visitedUserInfo }); //!not showing visited user info
            dispatch(setVisitedUserInfo(result.data.result[0]));
          }
        }
      })
      .catch((error) => {
        console.log({ from_getUserInfo_ProfileImgs_error: error });
      });
  };
  console.log({ visitedUserInfo: visitedUserInfo }); //!

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
        message: "Upload your profile photo",
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
        message: "Upload your cover photo",
        details: "",
        show: true,
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
              {currentUserInfo.firstName.toUpperCase() +
                " " +
                currentUserInfo.lastName.toUpperCase()}
            </h3>
          ) : (
            <h3>
              {visitedUserInfo.firstName.toUpperCase() +
                " " +
                visitedUserInfo.lastName.toUpperCase()}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileImgs;
