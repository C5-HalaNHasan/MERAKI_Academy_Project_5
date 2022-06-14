import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setAllUsers,
  addToFriendsList,
  setSuggestedFriends
} from "../redux/reducers/user/index";
import "./suggested.css";
const Suggested = () => {
  const dispatch = useDispatch();
  const { token, allUsers, suggestedFriends, userId } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
      allUsers: state.user.allUsers,
      suggestedFriends: state.user.suggestedFriends
    };
  });
  const navigate = useNavigate();
  const suggest = () => {
    axios
      .get(`http://localhost:5000/user/Friend/suggestedUser`, {
        headers: {
          Authorization: token
        }
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
  useEffect(() => suggest(), []);
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
        <div className="userIcon">
          <div className="suggest">
            <h3>suggestedFriend</h3>
          </div>
          {suggestedFriends.map((user, index) => {
            console.log(arr.includes(user.id));
            if (index < 3) {
              // console.log(user.id);

              return (
                <div className="suggestedFriend">
                  <div className="userI">
                    <img
                      src={user.profileImg}
                      onClick={(e) => navigate(`/user/${user.id}`)}
                    ></img>
                    <h4>
                      {user.firstName} {user.lastName}
                    </h4>
                  </div>
                  <div className="userButton">
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
