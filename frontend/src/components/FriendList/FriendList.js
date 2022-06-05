import React, { useEffect, useState } from "react";
import "./friendList.css";
import axios from "axios";
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
        if (id == userId) {
          dispatch(setCurrentUserFriends(response.data.result));//! to be used later
        } else {
          dispatch(setVisitedUserFriends(response.data.result));//! to be used later
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
  console.log({ visitedUserFriends });

  //! problem: id of friendship table is used not user id// to be solved in the backend
  return (
    <div className="friendListComponent">
      friendListComponent
      <div className="friendIcon ">
      {userId==id?(<>
        { currentUserFriends.length &&
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
          </>
      ):(<>
        { visitedUserFriends.length &&
          visitedUserFriends.map((friend, index) => {
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



      </>
      )}
      </div>//!ends of friendIcon
    </div>
  );
};

export default FriendList;
//
