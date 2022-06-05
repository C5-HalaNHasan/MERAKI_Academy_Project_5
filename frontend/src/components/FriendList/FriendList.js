import React, { useEffect, useState } from "react";
import "./friendList.css";
import axios from "axios";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setVisitedUserFriends,
  setCurrentUserFriends
} from "../redux/reducers/user/index";

const FriendList = ({ id }) => {
  //! FriendList component to be modified based on the following:
  //if id=userId: dispatch(setCurrentUserFriends ({getAllFriendsByUserId from backend}))
  //if id!=userId: disptch(setVisitedUserFriends({getAllFriendsByUserId from backend}))
  const dispatch = useDispatch();
  const { token, userId, currentUserFriends, visitedUserFriends } = useSelector(
    (state) => {
      return {
        token: state.user.token,
        userId: state.user.userId,
        currentUserFriends: state.user.currentUserFriends,
        visitedUserFriends: state.user.visitedUserFriends
      };
    }
  );
  const navigate = useNavigate();
  const getAllFriends = async () => {
    const response = await axios
      .get(`http://localhost:5000/user/friends/${userId}`, {
        headers: {
          Authorization: token
        }
      })
      .then((response) => {
        console.log(response.data.result);
        if (id == userId) {
          dispatch(setCurrentUserFriends(response.data.result));
        } else {
          dispatch(setVisitedUserFriends(response.data.result));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAllFriends();
  }, []);
  console.log({ currentUserFriends });
  return (
    <div className="friendListComponent">
      friendListComponent
      <div className="freiendIcon">
        {currentUserFriends.length &&
          currentUserFriends.map((friend, index) => {
            return (
              <>
                <div key={index}>
                  <img
                    src={friend.profileImg}
                    id={friend.id}
                    onClick={(e) => navigate(`/user/${e.target.id}`)}
                  ></img>
                  <h4>{friend.firstName}</h4>
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
};

export default FriendList;
//
