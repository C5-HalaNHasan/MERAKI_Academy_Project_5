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
  //to re-render visitedUser Friends:
  const getAllFriendsOfVisitedUser = async () => {
    let getFriendsUrl = ` http://localhost:5000/user/friends/${id}`;
    axios
      .get(getFriendsUrl, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.success) {
          dispatch(setVisitedUserFriends(result.data.result));
        }
      })
      .catch((error) => {
        console.log({ fromGetAllFriends_error: error });
      });
  };

  //to re-render the currentUser Friends
  const getAllFriendsOfCurrentUser = async () => {
    let getFriendsUrl = ` http://localhost:5000/user/friends/${userId}`;
    axios
      .get(getFriendsUrl, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.success) {
          dispatch(setCurrentUserFriends(result.data.result));
        }
      })
      .catch((error) => {
        console.log({ fromGetAllFriends_error: error });
      });
  };
  useEffect(() => {
    getAllFriendsOfVisitedUser();
    getAllFriendsOfCurrentUser();
  }, []);

  return (
    <div className="friendListComponent">
      <div className="friendList" style={{ maxHeight: "18em" }}>
        <div className="boxTitle">
          <h3>FriendList</h3>
        </div>
        {!currentUserFriends.length && <h3>This user has no friends yet...</h3>}
        {userId == id ? (
          <>
            {currentUserFriends.length &&
              currentUserFriends.map((friend, index) => {
                if (index < 3) {
                  return (
                    <div key={index} className="friendCard">
                      <div className="friendInfo">
                        <img src={friend.profileImg}></img>
                        <h4>{friend.firstName + " " + friend.lastName}</h4>
                      </div>
                      <div className="friendButtons">
                        <button
                          id={friend.id}
                          onClick={(e) => navigate(`/user/${e.target.id}`)}
                        >
                          Visit
                        </button>
                      </div>
                    </div>
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
                    <div key={index} className="friendCard">
                      <div className="friendInfo">
                        <img
                          src={friend.profileImg}
                          style={{ width: "3em", height: "3em" }}
                        ></img>
                        <h4>{friend.firstName + " " + friend.lastName}</h4>
                      </div>
                      <div className="friendButtons">
                        <button
                          id={friend.id}
                          onClick={(e) => navigate(`/user/${e.target.id}`)}
                        >
                          Visit
                        </button>
                      </div>
                    </div>
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
        {currentUserFriends.length <= 3 && id == userId && (
          <h3
            className="showMore"
            onClick={() => {
              navigate(`/users/discover/a`);
            }}
          >
            Discover...
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
