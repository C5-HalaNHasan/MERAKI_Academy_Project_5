import "./login.css";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLogin, setLogout } from "../redux/reducers/user/index";
import { GoogleLogin } from "react-google-login";
import { setModalBox } from "../redux/reducers/modalBox/index";

const Login = () => {
  //to redirect the user to the home page
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //to store user inputs in inputs fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("123456");
  const [country, setCountry] = useState("Jordan");
  const [gender, setGender] = useState("0");
  const [birthday, setBirthday] = useState("2001-01-01");
  const clientId =
    "171142303177-dlklu0me533t11g37ll28pjmd603vh8c.apps.googleusercontent.com";
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
  const loginErrorMessage = (message) => {
    dispatch(
      setModalBox({
        modalId: "",
        modalType: "notOk",
        modalMessage: "Login Error",
        modalDetails: message,
        modalShow: true,
      })
    );
  };
  const onSuccess = (res) => {
    console.log(res);
    axios
      .post("http://localhost:5000/user", {
        firstName: res.profileObj.givenName,
        lastName: res.profileObj.familyName,
        email: res.profileObj.email,
        password: newPassword,
        profileImg: res.profileObj.imageUrl,
        country,
        gender,
        birthday,
        role_id: 1,
      })
      .then(async (result) => {
        // will make the login automatically so that the user can navigate the site once registered(by using the login component here
        if (result.data.success == true) {
          //an automatic login in is going to be made and the user will be redirected to the main page (once created)
          await axios
            .post("http://localhost:5000/user/login", {
              email: res.profileObj.email,
              password: newPassword,
            })
            .then(async (result1) => {
              console.log({ fromregister: result1 });
              dispatch(
                setLogin({
                  token: result1.data.token,
                  userId: result1.data.userId,
                })
              );
              navigate("/home");
            })
            .catch((error1) => {
              dispatch(setLogout);
              loginErrorMessage(error1.response.data.message);
            });
        }
      })
      .catch(async (error) => {
        dispatch(setLogout);
        loginErrorMessage(error.response.data.messagee);
        if (
          error.response.data.message == "this email exists in the dataBase"
        ) {
          await axios
            .post("http://localhost:5000/user/login", {
              email: res.profileObj.email,
              password: newPassword,
            })
            .then(async (result1) => {
              console.log({ fromregister: result1 });
              dispatch(
                setLogin({
                  token: result1.data.token,
                  userId: result1.data.userId,
                })
              );
              navigate("/home");
            })
            .catch((error1) => {
              dispatch(setLogout);
              loginErrorMessage(error1.response.data.message);
            });
        }
      });
  };

  const LoginAction = () => {
    const loginUrl = "http://localhost:5000/user/login";
    axios
      .post(loginUrl, { email, password })
      .then((result) => {
        if (result.data.token) {
          dispatch(
            setLogin({ token: result.data.token, userId: result.data.userId })
          );
          if (result.data.userInfo.role_id == 2) {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        }
      })
      .catch((error) => {
        dispatch(setLogout);
        loginErrorMessage(error.response.data.message);
      });
  };
  return (
    <div className="registerComponent">
      <div className="loginBox">
        <h3>Login</h3>
        <div>
          Not a member yet?
          <span>
            <Link to="/register">Register</Link>
          </span>
        </div>
        <div className="inputField">
          <label>Email:</label>
          <input
            type="email"
            placeholder="email..."
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          ></input>
        </div>
        <div className="inputField">
          <label>PassWord:</label>
          <input
            type="password"
            placeholder="Password..."
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
          ></input>
        </div>
        <GoogleLogin clientId={clientId} onSuccess={onSuccess} />
        <button
          onClick={() => {
            LoginAction();
          }}
          className="btn"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
