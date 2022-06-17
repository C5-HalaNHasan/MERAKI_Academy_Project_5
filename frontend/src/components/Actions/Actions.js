import React, { useEffect, useState } from "react";
import "./actions.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFriendsList,
  removeFromFriendsList,
  setCurrentUserFriends,
  setVisitedUserFriends,
} from "../redux/reducers/user/index";
import { setModalBox } from "../redux/reducers/modalBox/index";

const Actions = ({ id }) => {
  const [isReported, setIsReported] = useState("Report");
  const [isFriend, setIsFriend] = useState();
  //currentUser can addFriend(if not in  currentUserFriends) or removeFriend(if in currentUserFriends)/reportUser/sendMessage
  const dispatch = useDispatch();
  //user states:
  const { token, userId, currentUserFriends } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
      currentUserFriends: state.user.currentUserFriends,
      setVisitedUserFriends: state.user.setVisitedUserFriends,
    };
  });
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

  //a function that reports a user by id/ this function will be handeled inside ModalBox component:
  const reportUserById = () => {
    dispatch(
      setModalBox({
        modalId: id,
        modalType: "report",
        modalMessage: "Report User",
        modalDetails: "",
        modalShow: true,
      })
    );
  };
  //a function that sends a message to user by id:
  const sendMessageToUser = () => {
    dispatch(
      setModalBox({
        modalId: id,
        modalType: "sendMessage",
        modalMessage: "Send Message",
        modalDetails: "",
        modalShow: true,
      })
    );
  };
  //a function that adds a user as a friend if not in currentUserFriends
  const addFriend = (id) => {
    let addFriendUrl = `https://warriors300-project5-backend.herokuapp.com/user/${id}`;
    axios
      .post(addFriendUrl, {}, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.success) {
          dispatch(addToFriendsList(result.data.result[0]));
          getAllFriendsOfCurrentUser();
          getAllFriendsOfVisitedUser();
          setIsFriend(true);
        }
      })
      .catch((error) => {
        console.log({ fromAddFriend_error: error });
      });
  };

  //a function that removes a user from currentUserFriends if
  const removeFriend = (id) => {
    let removeUserUrl = `https://warriors300-project5-backend.herokuapp.com/user/${id}`;
    axios
      .delete(removeUserUrl, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.success) {
          dispatch(removeFromFriendsList(id));
          setIsFriend(false);
          getAllFriendsOfCurrentUser();
          getAllFriendsOfVisitedUser();
        }
      })
      .catch((error) => {
        console.log({ fromRemoveFriend_error: error });
      });
  };

  //check if friends:
  const checkIfFriend = () => {
    let checked = currentUserFriends.filter((friend) => {
      return friend.id == id;
    });
    return checked.length ? setIsFriend(true) : setIsFriend(false);
  };

  //to re-render visitedUser Friends:
  const getAllFriendsOfVisitedUser = async () => {
    let getFriendsUrl = ` https://warriors300-project5-backend.herokuapp.com/user/friends/${id}`;
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

  //to re-render the currentUser Friends (for Add/Remove)
  const getAllFriendsOfCurrentUser = async () => {
    let getFriendsUrl = ` https://warriors300-project5-backend.herokuapp.com/user/friends/${userId}`;
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
    checkIfFriend();
  }, []);

  return (
    <div className="actionsComponent">
      <div className="boxTitle">
        <h3>Actions</h3>
      </div>
      <div className="actionButtons">
        {isFriend ? (
          <button onClick={() => removeFriend(id)}>Remove</button>
        ) : (
          <button onClick={() => addFriend(id)}>Add</button>
        )}
        <button onClick={() => sendMessageToUser()}>Send Message</button>
        <button onClick={() => reportUserById()}>{isReported}</button>
      </div>
    </div>
  );
};

export default Actions;
