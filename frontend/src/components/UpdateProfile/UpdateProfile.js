import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserInfo } from "../redux/reducers/user/index";
import "./updateProfile.css";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hashedPassword, setHashedPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [country, setCountry] = useState("");
  const [isPrivate, setIsPrivate] = useState(0);
  const dispatch = useDispatch();
  const { currentUserInfo, token } = useSelector((state) => {
    return {
      currentUserInfo: state.user.currentUserInfo,
      token: state.user.token
    };
  });
  useEffect(() => {
    console.log(token);
    axios
      .put(
        "http://localhost:5000/user",
        { headers: { authorization: token } },

        {
          firstName,
          lastName,
          hashedPassword,
          birthday,
          country,
          isPrivate
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="updateProfileComponent">
      updateProfileComponent
      <div className="input">
        <label>FirstName :</label>
        <input
          type="text"
          placeholder="FirstName....."
          name="firstName"
          onChange={(e) => {
            setFirstName(e.target.value);
            //   console.log(e.target.value);
          }}
        ></input>
      </div>
      <div className="input">
        <label>lastName :</label>
        <input
          type="text"
          placeholder="lastName....."
          name="lastName"
          onChange={(e) => {
            setLastName(e.target.value);
            //   console.log(e.target.value);
          }}
        ></input>
      </div>
      <div className="input">
        <label>PassWord :</label>
        <input
          type="password"
          placeholder="password....."
          name="password"
          onChange={(e) => {
            setHashedPassword(e.target.value);
            //   console.log(e.target.value);
          }}
        ></input>
      </div>
      <div className="input">
        <label>country :</label>
        <input
          type="text"
          placeholder="country....."
          name="country"
          onChange={(e) => {
            setCountry(e.target.value);
            //   console.log(e.target.value);
          }}
        ></input>
      </div>
      <div className="input">
        <label>birthday :</label>
        <input
          type="date"
          placeholder="birthday....."
          name="birthday"
          onChange={(e) => {
            setBirthday(e.target.value);
            //   console.log(e.target.value);
          }}
        ></input>
      </div>
      <div className="checkbox">
        <label>isPrivate</label>
        <input
          type="checkbox"
          name="birthday"
          onChange={(e) => {
            console.log(e.target.value);
            setIsPrivate(1);
          }}
        ></input>
      </div>
      <div className="updateBut">
        <button
          onClick={() => {
            dispatch(
              updateUserInfo(
                firstName,
                lastName,
                hashedPassword,
                birthday,
                country,
                isPrivate
              )
            );
            navigate("/user/:id");
          }}
        >
          UpdateProfile
        </button>
      </div>
    </div>
  );
};

export default UpdateProfile;
