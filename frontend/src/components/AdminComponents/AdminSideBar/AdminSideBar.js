import React from "react";
import "./adminSideBar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//the AdminSideBar is going to act as a router to the DashBoard based on type
const AdminSideBar = () => {
  const navigate = useNavigate();

  //! a way to prevent nesting routes!(not done yet)
  const allUsers = () => {
    navigate(`/allUsers`);
  };
  const reportedUsers = () => {
    navigate("/reportedUsers");
  };
  const getReportedPosts = () => {
    navigate(`/reportedPosts`);
  };
  const reportedComments = () => {
    navigate(`/reportedComments`);
  };
  const charts = () => {
    navigate(`/charts`);
  };
  return (
    <div className="adminSideBarComponent">
      
      <h3 className="SideBar"
        onClick={() => {
          allUsers();
        }}
      >
        Get All Users
      </h3>
      <h3
      className="SideBar"
        onClick={() => {
          reportedUsers();
        }}
      >
        Get Reported Users
      </h3>
      <h3
      className="SideBar"
        onClick={() => {
          getReportedPosts();
        }}
      >
        Get Reported Posts
      </h3>
      <h3
      className="SideBar"
        onClick={() => {
          reportedComments();
        }}
      >
        Get Reported Comments
      </h3>
      <h3
      className="SideBar"
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
