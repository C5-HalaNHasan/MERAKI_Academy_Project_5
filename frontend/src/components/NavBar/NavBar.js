import React from "react";
import "./navBar.css";
import { BiSearch } from "react-icons/bi";
import { BsMessenger } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const NavBar = () => {
  const navigate = useNavigate();
  return (
    <div className="navBarComponent">
      <div className="navBarLeft">
        <span className="logo">Facebook</span>
      </div>
      <div className="navBarCenter">
        <div className="searchBar">
          <BiSearch className="searchIcon" />
          <input
            placeholder="Search for a friend.."
            className="inputSearch"
            onClick={() => {}}
            onChange={() => {}}
          />
        </div>
      </div>
      <div className="navBarRight">
        <div className="navBarIcons">
          <div className="navBarMessages">
            <BsMessenger onClick={() => {}} />
          </div>
          <div className="navBarMessages">
            <FiSettings onClick={() => {}} />
          </div>
          <div className="navBarMessages">
            <HiOutlineLogout onClick={() => {}} />
          </div>
        </div>
        <img src="https://res.cloudinary.com/dl2kfs2nu/image/upload/v1653160801/mhqxzisztvpv4h43q1ly.jpg" />
      </div>
    </div>
  );
};

export default NavBar;
