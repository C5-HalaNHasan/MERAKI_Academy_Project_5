import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentUserInfo,
  setVisitedUserInfo
} from "../redux/reducers/user/index";
import "./userInfo.css";
import { useNavigate } from "react-router-dom";

const UserInfo = ({ id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, userId, visitedUserInfo, currentUserInfo } = useSelector(
    (state) => {
      return {
        token: state.user.token,
        userId: state.user.userId,
        visitedUserInfo: state.user.visitedUserInfo,
        currentUserInfo: state.user.currentUserInfo
      };
    }
  );
  useEffect(() => {
    // console.log(id)
    // console.log(userId);;

    axios
      .get(`http://localhost:5000/user/${id}`, {
        headers: { authorization: token }
      })
      .then((respon) => {
        let result = respon.data.result[0];
        console.log(result);
        // console.log(result.gender);
        result.birthday = result.birthday.split("T")[0];
        if (result.gender === 0) {
          result.gender = "male";
        }
        if (id === userId) {
          dispatch(setCurrentUserInfo(result));
          console.log(result.birthday);
          console.log(result.gender);
        } else {
          // console.log(result.birthday);

          dispatch(setVisitedUserInfo(result));
          console.log(id);
          console.log(userId);
        }
        console.log(result.birthday);
        console.log(result.gender);
      })
      .catch((err) => {
        //   console.log(id)
        //     console.log(userId);;
        console.log(err);
      });
  }, []);
  console.log(currentUserInfo);
  console.log(visitedUserInfo);
  //! UserInfo component to be modified based on the following:
  //since this component will be shown in profile pages only: id is taken from userProfile Params
  //if id=userId: dispatch(setCurrentUserInfo({getUserById from backend}))
  //if id!=userId: disptch(setVisitedUserInfo({getUserById from backend}))
  return (
    <div className="userInfoComponent">
      userInfoComponent
      {id === userId ? (
        <div className="currentUser">
          <h4>
            {currentUserInfo.firstName} {currentUserInfo.lastName}
          </h4>
          {currentUserInfo.birthday ? (
            <h4>{currentUserInfo.birthday.split("T")[0]}</h4>
          ) : (
            ""
          )}

          <h4>{currentUserInfo.country}</h4>
          {currentUserInfo.gender === 0 ? <h4>Male</h4> : <h4>Female</h4>}
          <button
            onClick={(e) => {
              navigate(`/user/update/${id}`);
            }}
          >
            update
          </button>
        </div>
      ) : (
        <div className="visitUser">
          <h4>
            {visitedUserInfo.firstName} {visitedUserInfo.lastName}
          </h4>
          {visitedUserInfo.birthday ? (
            <h4>{visitedUserInfo.birthday.split("T")[0]}</h4>
          ) : (
            ""
          )}
          <h4>{visitedUserInfo.country}</h4>
          {visitedUserInfo.gender === 0 ? <h4>Male</h4> : <h4>Female</h4>}
        </div>
      )}
    </div>
  );
};

export default UserInfo;
