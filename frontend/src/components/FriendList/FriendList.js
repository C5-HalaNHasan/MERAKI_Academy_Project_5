import React, { useEffect, useState } from "react";
import "./friendList.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setVisitedUserFriends,
  setCurrentUserFriends,
} from "../redux/reducers/user/index";

const FriendList = ({ id }) => {
  const dispatch = useDispatch();
  const { token, userId, currentUserFriends, visitedUserFriends } = useSelector(
    (state) => {
      return {
        token: state.user.token,
        userId: state.user.userId,
        currentUserFriends: state.user.currentUserFriends,
        visitedUserFriends: state.user.visitedUserFriends,
      };
    }
  );
  const navigate = useNavigate();
  const getAllFriends = async () => {
    const response = await axios
      .get(`http://localhost:5000/user/friends/${userId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
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
  console.log({ visitedUserFriends });

  //! problem: id of friendship table is used not user id// to be solved in the backend
  return (
    <div className="friendListComponent">
      <div className="friendList">
        <div className="boxTitle">
          <h3>FriendList</h3>
        </div>
        {userId == id ? (
          <>
            {currentUserFriends.length &&
              currentUserFriends.map((friend, index) => {
                if (index < 3) {
                  return (
                    <>
                      <div key={index} className="renderedFriend">
                        <img
                          src={friend.profileImg}
                          id={friend.id}
                          onClick={(e) => navigate(`/user/${e.target.id}`)}
                        ></img>
                        <h4>{friend.firstName + " " + friend.lastName}</h4>
                      </div>
                    </>
                  );
                }
              })}
          </>
        ) : (
          <>
            {visitedUserFriends.length &&
              visitedUserFriends.map((friend, index) => {
                if (index < 3) {
                  return (
                    <>
                      <div key={index} className="renderedFriend">
                        <img
                          src={friend.profileImg}
                          id={friend.id}
                          onClick={(e) => navigate(`/user/${e.target.id}`)}
                        ></img>
                        <h4>{friend.firstName + " " + friend.lastName}</h4>
                      </div>
                    </>
                  );
                }
              })}
          </>
        )}
        {currentUserFriends.length > 3 && id == userId && (
          <h3
            className="showMore"
            onClick={() => {
              navigate(`/users/friendlist/${userId}`);
            }}
          >
            Show More...
          </h3>
        )}

        {visitedUserFriends.length > 3 && id !== userId && (
          <h3
            className="showMore"
            onClick={() => {
              navigate(`/users/friendlist/${id}`);
            }}
          >
            Show More...
          </h3>
        )}
      </div>
    </div>
  );
};

export default FriendList;
//
