import React, { useEffect, useState } from "react";
import "./navBar.css";
import axios from "axios";
import { BiSearch } from "react-icons/bi";
import { BsMessenger } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout,setCurrentUserInfo } from "../redux/reducers/user";
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

  //!useEffect to be used to dispatch(setCurrentUserInf(data from BE))
  const getCurrentUser=()=>{
    let getCurrentUserUrl=`http://localhost:5000/user/${userId}`;
    axios.get(getCurrentUserUrl,{headers:{authorization:token}}).then((result)=>{
      dispatch(setCurrentUserInfo(result.data.result[0]))
    }).catch((error)=>{
      console.log(error)
    })
  };
// console.log(currentUserInfo);
  useEffect(()=>{
    getCurrentUser();
  },[])

  return (
    <div className="navBarComponent">
      <div className="navBarLeft">
        <span
          className="logo"
          onClick={() => {
            navigate("/home");
          }}
        >
          Facebook
        </span>
      </div>

      <div className="navBarCenter">
        <div className="searchBar">
          <BiSearch className="searchIcon" />
          <input
            placeholder="Search for a friend.."
            className="inputSearch"
            onClick={() => {
              navigate(`/users/search/`);
            }}
            onChange={(e) => {
              setFind(e.target.value);
              navigate(`/users/search/${find}`);
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
                navigate(`/user/update/${userId}`);
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
        </div>
        <img className="userImg"
          src={currentUserInfo.profileImg}
          onClick={() => {
            navigate(`/user/${userId}`);
          }}
        />
        {/* ! to be update after reg */}
      </div>
    </div>
  );
};

export default NavBar;
