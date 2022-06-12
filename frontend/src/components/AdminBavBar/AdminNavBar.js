import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminNavBar.css"
import { HiOutlineLogout } from "react-icons/hi";
import { setLogout } from "../redux/reducers/user";
import { useDispatch } from "react-redux";
const AdminNavBar = () => {
  const dispatch = useDispatch();
const navigate = useNavigate()
  return (
    <div className="AdminNavBarComp">
      <div className="adminLeft">
        <span
          className="logo"
          onClick={() => {
            
              navigate("/home");
            
          }}
        >
          Facebook
        </span>
      </div>
      <div className="adminCenter">
        <p className="admin">
          Admin <span className="dash">DashBoard</span>
        </p>
      </div>
      <div className="adminRight">
        <HiOutlineLogout
        className="out"
          onClick={() => {
            dispatch(setLogout());
            navigate("/");
          }}
        />
      </div>
    </div>
  );
};
export default AdminNavBar;