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
  // const getAllFriends = () => {
  //   axios
  //     .get(`http://localhost:5000/user/friends/${userId}`, {
  //       headers: {
  //         Authorization: token,
  //       },
  //     })
  //     .then((response) => {
  //       if (id == userId) {
  //         dispatch(setVisitedUserFriends([]));
  //         dispatch(setCurrentUserFriends(response.data.result));
  //       } else {
  //         dispatch(setCurrentUserFriends([]));
  //         dispatch(setVisitedUserFriends(response.data.result));
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

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
    // getAllFriends();
    getAllFriendsOfVisitedUser();
    getAllFriendsOfCurrentUser();
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
        {currentUserFriends.length < 3 && id == userId && (
          <h3
            className="showMore"
            onClick={() => {
              navigate(`/users/search/a`);
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
