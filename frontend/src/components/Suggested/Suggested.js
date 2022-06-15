import axios from "axios";
import "./suggested.css";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setAllUsers,
  addToFriendsList,
  setSuggestedFriends,
  setCurrentUserFriends,
  removeFromFriendsList,
} from "../redux/reducers/user/index";

const Suggested = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, allUsers, suggestedFriends, userId } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
      allUsers: state.user.allUsers,
      suggestedFriends: state.user.suggestedFriends,
      currentUserFriends: state.user.currentUserFriends,
    };
  });
  //to re-render the currentUser Friends (for Add/Remove)
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
  //a function that adds a user as a friend if not in currentUserFriends
  const addFriend = (id) => {
    let addFriendUrl = `http://localhost:5000/user/${id}`;
    axios
      .post(addFriendUrl, {}, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.success) {
          dispatch(addToFriendsList(result.data.result[0]));
          getAllFriendsOfCurrentUser();
        }
      })
      .catch((error) => {
        console.log({ fromAddFriend_error: error });
      });
  };
  //a function that removes a user from currentUserFriends if
  const removeFriend = (toId) => {
    let removeUserUrl = `http://localhost:5000/user/${toId}`;
    axios
      .delete(removeUserUrl, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.success) {
          dispatch(removeFromFriendsList(result.data.result[0].id));
          getAllFriendsOfCurrentUser();
        }
      })
      .catch((error) => {
        console.log({ fromRemoveFriend_error: error });
      });
  };
  const suggest = () => {
    axios
      .get(`http://localhost:5000/user/Friend/suggestedUser`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data.result);
        dispatch(setSuggestedFriends(res.data.result));
        // console.log(suggestedFriends);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    suggest();
    getAllFriendsOfCurrentUser();
  }, []);
  console.log(suggestedFriends);

  // loop to get three random suggest friend
  const arr = [];
  const list = () => {
    for (let i = 0; i < 3; i++) {
      let x = Math.floor(Math.random() * suggestedFriends.length);

      arr.push(x);
    }
  };

  list();
  console.log(arr);

  return (
    <>
      <div className="suggestedComponent">
        <div className="friendList">
          <div className="boxTitle">
            <h3>Suggested Friend</h3>
          </div>
          {suggestedFriends.map((user, index) => {
            console.log(arr.includes(user.id));
            if (index < 3) {
              return (
                <div className="friendCard">
                  <div className="friendInfo">
                    <img
                      src={user.profileImg}
                      onClick={(e) => navigate(`/user/${user.id}`)}
                      style={{ width: "3em", height: "3em" }}
                    ></img>
                    <h4>
                      {user.firstName} {user.lastName}
                    </h4>
                  </div>
                  <div className="friendButtons">
                    {/* for add and remove buttons */}
                    {/* {currentUserFriends.some(
                      (currentFriend) => currentFriend.id == user.id
                    ) ? (
                      <button
                        onClick={() => {
                          removeFriend(user.id);
                        }}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          addFriend(user.id);
                        }}
                      >
                        Add
                      </button>
                    )} */}
                    {/* end of add and remove buttons */}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </>
  );
};

export default Suggested;
