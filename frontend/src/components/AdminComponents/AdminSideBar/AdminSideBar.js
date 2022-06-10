import React from "react";
import "./adminSideBar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//the AdminSideBar is going to act as a router to the DashBoard based on type
const AdminSideBar = () => {
  const navigate = useNavigate();

  //! a way to prevent nesting routes!(not done yet)
  const allUsers = () => {
    // navigate(`admin/allUsers`);
  };
  const reportedUsers = () => {
    // navigate(`admin/reportedUsers`);
  };
  const reportedPosts = () => {
    // navigate(`admin/reportedPosts`);
  };
  const charts = () => {
    // navigate(`admin/charts`);
  };
  return (
    <div className="adminSideBarComponent">
      adminSideBarComponent
      <h3
        onClick={() => {
          allUsers();
        }}
      >
        Get All Users
      </h3>
      <h3
        onClick={() => {
          reportedUsers();
        }}
      >
        Get Reported Users
      </h3>
      <h3
        onClick={() => {
          reportedPosts();
        }}
      >
        Get Reported Posts
      </h3>
      <h3
        onClick={() => {
          charts();
        }}
      >
        Charts & Statistics
      </h3>
    </div>
  );
};

export default AdminSideBar;
