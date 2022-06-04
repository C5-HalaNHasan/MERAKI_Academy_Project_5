import React from "react";
import "./navBar.css";
import { BiSearch } from "react-icons/bi";
import { BsMessenger } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/reducers/user";
const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, allUsers,userId } = useSelector((state) => {
    return {
      token: state.user.token,
      allUsers: state.user.allUsers,
      userId:state.user.userId
    };
  });
  console.log(allUsers);
  return (
    <div className="navBarComponent">
      <div className="navBarLeft">
        <span className="logo" onClick={()=>{
            navigate("/home")
        }} >Facebook</span>
      </div>
 
      <div className="navBarCenter">
        <div className="searchBar">
          <BiSearch className="searchIcon" />
          <input
            placeholder="Search for a friend.."
            className="inputSearch"
            onClick={() => {
                navigate("/users/search")
            }}
            onChange={(e) => {}}
          />
          {/* to be updated after users/search is done */}
        </div>
      </div>
      <div className="navBarRight">
        <div className="navBarIcons">
          <div className="navBarMessages">
            <BsMessenger onClick={() => {
                navigate("/message")
            }} />
          </div>
          <div className="navBarMessages">
            <FiSettings onClick={() => {
                navigate(`/user/update/${userId}`)
            }} />
          </div>
          <div className="navBarMessages">
            <HiOutlineLogout
              onClick={() => {
                dispatch(setLogout());
                navigate("/Login")
              }}
            />
          </div>
        </div>
        <img src="https://res.cloudinary.com/dl2kfs2nu/image/upload/v1653160801/mhqxzisztvpv4h43q1ly.jpg" onClick={()=>{
            navigate(`/user/${userId}`)
        }}/> 
        {/* ! to be update after reg */}
      </div>
   
    </div>
   
  );
};

export default NavBar;
