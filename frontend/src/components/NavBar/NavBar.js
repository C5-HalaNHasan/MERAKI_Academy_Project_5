import React, { useEffect, useState } from "react";
import "./navBar.css";
import axios from "axios";
import { BiSearch } from "react-icons/bi";
import { BsMessenger } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout, setCurrentUserInfo } from "../redux/reducers/user";
import { setModalBox } from "../redux/reducers/modalBox/index";
import {RiAdminFill} from "react-icons/ri"

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, currentUserInfo, userId } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
      currentUserInfo: state.user.currentUserInfo,
    };
  });
  const [find, setFind] = useState("");
  //modalBox states(modal box is going to be used to update user profile):
  const { modalId, modalType, modalMessage, modalDetails, modalShow } =
    useSelector((state) => {
      return {
        modalId: state.modalBox.modalId,
        modalType: state.modalBox.modalType,
        modalMessage: state.modalBox.modalMessage,
        modalDetails: state.modalBox.modalDetails,
        modalShow: state.modalBox.modalShow,
      };
    });
  const updateUserProfile = () => {
    dispatch(
      setModalBox({
        modalId: "",
        modalType: "updateProfile",
        modalMessage: "Update Profile Info",
        modalDetails: "",
        modalShow: true,
      })
    );
  };

  //!useEffect to be used to dispatch(setCurrentUserInf(data from BE))
  const getCurrentUser = () => {
    let getCurrentUserUrl = `http://localhost:5000/user/${userId}`;
    axios
      .get(getCurrentUserUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setCurrentUserInfo(result.data.result[0]));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // console.log(currentUserInfo);
  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <div className="navBarComponent">
      <div className="navBarLeft">
        <span
          className="logo"
          onClick={() => {
        if(token){
          navigate("/home")
        }
          }}
        >
          Facebook
        </span>
      </div>

     {token? <> <div className="navBarCenter">
        <div className="searchBar">
          <BiSearch className="searchIcon" />
          <input
            placeholder="Search for a friend.."
            className="inputSearch"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                navigate(`/users/search/${find}`);
              }
            }}
            onChange={(e) => {
              setFind(e.target.value);
            }}
          />

          {/* to be updated after users/search is done */}
        </div>
      </div>
      <div className="navBarRight">
        <div className="navBarIcons">
          <div className="navBarMessages">
            <BsMessenger
              onClick={() => {
                navigate("/message");
              }}
            />
          </div>
          <div className="navBarMessages">
            <FiSettings
              onClick={() => {
                // navigate(`/user/update/${userId}`);
                updateUserProfile();
              }}
            />
          </div>
          <div className="navBarMessages">
            <HiOutlineLogout
              onClick={() => {
                dispatch(setLogout());
                navigate("/");
              }}
            />
          </div>
         {currentUserInfo.role_id ==1 ?
         <div className="navBarMessages">
            <RiAdminFill
            className="adminIcon"
              onClick={() => {
                
                navigate("/charts");
              }}
            />
          </div>:""}
        </div>
        <img
          className="userImg"
          src={currentUserInfo.profileImg}
          onClick={() => {
            navigate(`/user/${userId}`);
          }}
        />
      </div> </>:""}
    </div>
  );
};

export default NavBar;
