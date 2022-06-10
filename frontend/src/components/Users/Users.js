import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllUsers,
  setCurrentUserFriends,
  addToFriendsList
} from "../redux/reducers/user";
import { setModalBox } from "../redux/reducers/modalBox/index";

import "./users.css";

//Users component will take two props:type(search or friendlist) & name (name of the searched user)
const Users = ({ type, name }) => {
  const dispatch = useDispatch();
  const { allUsers, token, userId, currentUserFriends } = useSelector(
    (state) => {
      return {
        allUsers: state.user.allUsers,
        token: state.user.token,
        userId: state.user.userId,
        currentUserFriends: state.user.currentUserFriends
      };
    }
  );
  // 
  if (type === "search") {
    useEffect(() => {
      axios
        .get(`http://localhost:5000/user`)
        .then((result) => {
          console.log(result.data.result);
          dispatch(setAllUsers(result.data.result));
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
  } else if (type === "friendlist") {
    useEffect(() => {
      axios
        .get(`http://localhost:5000/user/friends/:${userId}`, {
          headers: { authorization: token }
        })
        .then((res) => {
          dispatch(setCurrentUserFriends(res.data.result));
          console.log(currentUserFriends);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
  }
  return (
    <div className="usersComponent">
      {type === "search"
        ? allUsers.map((user, index) => {
            if (user.firstName.includes(name)) {
              return (
                <>
                  <div className="username">
                    <img src={user.profileImg}></img>
                    <h3>
                      {user.firstName}.{user.lastName}{" "}
                    </h3>
                  </div>
                  <div className="action button">
                    <button
                      onClick={() => {
                        let addFriendUrl = `http://localhost:5000/user/${user.id}`;
                        axios
                          .post(
                            addFriendUrl,
                            {},
                            { headers: { authorization: token } }
                          )
                          .then((result) => {
                            if (result.data.success) {
                              dispatch(addToFriendsList(result.data.result[0]));
                            }
                          })
                          .catch((error) => {
                            console.log({ fromAddFriend_error: error });
                          });
                      }}
                    >
                      Add
                    </button>
                    
                  </div>
                </>
              );
            }
          })
        : currentUserFriends.map((friend, index) => {})}
      usersComponent
    </div>
  );
};

export default Users;
