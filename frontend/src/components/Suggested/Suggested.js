import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useNavigate } from "react-router-dom";
import {
  setAllUsers,
  addToFriendsList,
  currentUserFriends
} from "../redux/reducers/user";
import "./suggested.css";
const Suggested = () => {
  const dispatch = useDispatch();
  const { token, allUsers, currentUserFriends } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
      allUsers: state.user.allUsers,
      currentUserFriends: state.user.currentUserFriends
    };
  });
  // console.log(currentUserFriends);
  const navigate = useNavigate();
  const getAllUsers = async () => {
    const res = await axios
      .get(`http://localhost:5000/user`, {
        headers: {
          Authorization: token
        }
      })
      .then((res) => {
        // console.log(res.data.result);
        dispatch(setAllUsers(res.data.result));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  // console.log(allUsers);
  // __________
  // for loop to check if the allUsers include the id of the currentFriend
  // if not include push it to new array
  // after that you need to pick 3 user randomly

  const arr = [];
  const list = () => {
    for (let i = 0; i < 3; i++) {
      let x = Math.floor(Math.random() * allUsers.length);
     

      arr.push(x);
    }
    // currentUserFriends.map((currentFriend, index) => {
    //   console.log(currentFriend.id);
    //   console.log(x);
    //   if (x == currentFriend.id) {
    //     arr.push(x);
    //   }
    // });
    // console.log(x);
    // console.log(arr);
  };

  list();
  console.log(arr);

  return (
    <>
      <div className="suggestedComponent">
        suggestedComponent
        <div className="userIcon">
          {allUsers.map((user, index) => {
            console.log(arr.includes(user.id));
            if (!arr.includes(user.id)) {
              // console.log(user.id);

              return (
                <>
                  <div className="userImg">
                    <img
                      src={user.profileImg}
                      onClick={(e) => navigate(`/user/${user.id}`)}
                    ></img>
                  </div>
                  <div className="userName">
                    <h4>
                      {user.firstName}.{user.lastName}
                    </h4>

                    <button
                      //   to make function that send request to add friend
                      onClick={() => {
                        // console.log(user.id);
                        //  let {id}=user.id
                        let addFriendUrl = `http://localhost:5000/user/${user.id}`;
                        axios
                          .post(
                            addFriendUrl,
                            {},
                            { headers: { authorization: token } }
                          )
                          .then((result) => {
                            // console.log(result);
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
          })}
        </div>
      </div>
    </>
  );
};

export default Suggested;
