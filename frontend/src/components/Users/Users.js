import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllUsers,
  setCurrentUserFriends,
  addToFriendsList,
  removeFromFriendsList,
} from "../redux/reducers/user";
import { setModalBox } from "../redux/reducers/modalBox/index";
import "./users.css";

//Users component will take two props:type(search or friendlist) & name (name of the searched user)
const Users = ({ type, name }) => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  //modalBox states:
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
  const dispatch = useDispatch();
  const { allUsers, token, userId, currentUserFriends } = useSelector(
    (state) => {
      return {
        allUsers: state.user.allUsers,
        token: state.user.token,
        userId: state.user.userId,
        currentUserFriends: state.user.currentUserFriends,
        allUsers: state.user.allUsers,
      };
    }
  );
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
  //a function that sends a message to user by id:
  const sendMessageToUser = (toId) => {
    dispatch(
      setModalBox({
        modalId: toId,
        modalType: "sendMessage",
        modalMessage: "Send Message",
        modalDetails: "",
        modalShow: true,
      })
    );
  };
  //a function that reports a user by id/ this function will be handeled inside ModalBox component:
  const reportUserById = (toId) => {
    dispatch(
      setModalBox({
        modalId: toId,
        modalType: "report",
        modalMessage: "Report User",
        modalDetails: "",
        modalShow: true,
      })
    );
  };
  //a function that removes a user from currentUserFriends if
  const removeFriend = (toId) => {
    let removeUserUrl = `http://localhost:5000/user/${toId}`;
    axios
      .delete(removeUserUrl, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.success) {
          dispatch(removeFromFriendsList(toId));
          getAllFriendsOfCurrentUser();
        }
      })
      .catch((error) => {
        console.log({ fromRemoveFriend_error: error });
      });
  };

  //to check the type sent if search or friendlist and render the users based on that:
  if (type == "search") {
    useEffect(() => {
      axios
        .get(`http://localhost:5000/user`, {
          headers: { authorization: token },
        })
        .then((result) => {
          let filtered = result.data.result.filter((user) => {
            return user.id !== userId;
          });
          dispatch(
            setAllUsers(
              result.data.result.filter((user) => {
                return user.id !== userId;
              })
            )
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
  } else if (type == "friendlist") {
    useEffect(() => {
      axios
        .get(`http://localhost:5000/user/friends/:${userId}`, {
          headers: { authorization: token },
        })
        .then((res) => {
          dispatch(setCurrentUserFriends(res.data.result));
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
  } else if (type == "discover") {
    useEffect(() => {
      dispatch(setAllUsers([]));
      axios
        .get(`http://localhost:5000/user/Friend/suggestedUser`, {
          headers: { authorization: token },
        })
        .then((res) => {
          dispatch(setAllUsers(res.data.result));
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
  }

  return (
    <div className="usersComponent">
      <div className="friendList usersList">
        <div className="boxTitle">
          <h3>Result</h3>
        </div>
        {type == "search"
          ? allUsers.map((user, index) => {
              if (
                user.firstName.toLowerCase().includes(name.toLowerCase()) ||
                user.lastName.toLowerCase().includes(name.toLowerCase())
              ) {
                return (
                  <div className="friendCard">
                    <div className="friendInfo">
                      <img
                        src={user.profileImg}
                        onClick={() => {
                          navigate(`/user/${user.id}`);
                        }}
                      ></img>
                      <h3>{user.firstName + " " + user.lastName}</h3>
                    </div>
                    <div className="friendButtons">
                      {/* for add and remove buttons */}
                      {currentUserFriends.some(
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
                      )}
                      <button
                        onClick={() => {
                          sendMessageToUser(user.id);
                        }}
                      >
                        Message
                      </button>
                      <button
                        onClick={() => {
                          reportUserById(user.id);
                        }}
                      >
                        Report
                      </button>
                    </div>
                  </div>
                );
              }
            })
          : currentUserFriends.map((friend, index) => {
              return (
                <div className="friendCard">
                  <div className="friendInfo">
                    <img
                      src={friend.profileImg}
                      onClick={() => {
                        navigate(`/user/${friend.id}`);
                      }}
                    ></img>
                    <h3>
                      {friend.firstName} {friend.lastName}{" "}
                    </h3>
                  </div>
                  <div className="friendButtons">
                    {currentUserFriends.some(
                      (currentFriend) => currentFriend.id == friend.id
                    ) ? (
                      <button
                        onClick={() => {
                          removeFriend(friend.id);
                        }}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          addFriend(friend.id);
                        }}
                      >
                        Add
                      </button>
                    )}

                    <button
                      onClick={() => {
                        sendMessageToUser(friend.id);
                      }}
                    >
                      Message
                    </button>
                    <button
                      onClick={() => {
                        reportUserById(friend.id);
                      }}
                    >
                      Report
                    </button>
                  </div>
                </div>
              );
            })}
        {/* starts here */}
        {type == "discover" &&
          allUsers.map((user, index) => {
            if (
              user.id !== userId &&
              !currentUserFriends.some(
                (currentFriend) => currentFriend.id == user.id
              )
            ) {
              return (
                <div className="friendCard">
                  <div className="friendInfo">
                    <img
                      src={user.profileImg}
                      onClick={() => {
                        navigate(`/user/${user.id}`);
                      }}
                    ></img>
                    <h3>{user.firstName + " " + user.lastName}</h3>
                  </div>
                  <div className="friendButtons">
                    {/* for add and remove buttons */}
                    {currentUserFriends.some(
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
                    )}
                    <button
                      onClick={() => {
                        sendMessageToUser(user.id);
                      }}
                    >
                      Message
                    </button>
                    <button
                      onClick={() => {
                        reportUserById(user.id);
                      }}
                    >
                      Report
                    </button>
                  </div>
                </div>
              );
            }
          })}
        {/* ends here */}
      </div>
    </div>
  );
};

export default Users;
