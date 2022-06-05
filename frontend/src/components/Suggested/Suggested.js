import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAllUsers } from "../redux/reducers/user";
import "./suggested.css";

const Suggested = () => {
  const dispatch = useDispatch();
  const { token, allUsers } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
      allUsers: state.user.allUsers
    };
  });
  const navigate = useNavigate();
  const getAllUsers = async () => {
    const res = await axios
      .get(`http://localhost:5000/user`, {
        headers: {
          Authorization: token
        }
      })
      .then((res) => {
        console.log(res.data.result);
        dispatch(setAllUsers(res.data.result));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <>
      <div className="suggestedComponent">
        suggestedComponent
        <div className="userIcon">
          {allUsers.map((user, index) => {
            return (
              <>
                <div key={index}>
                  <img src={user.profileImg}></img>
                  <h4>
                    {user.firstName}.{user.lastName}
                  </h4>
                  <button
                    onClick={() => {
                    //   axios
                    //     .post("http://localhost:5000/user/:id")
                    //     .then((result) => {
                    //       console.log(result);
                    //     });
                    }}
                  >
                    Add
                  </button>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Suggested;
