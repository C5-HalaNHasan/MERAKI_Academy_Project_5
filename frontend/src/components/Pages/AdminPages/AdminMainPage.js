import React from "react";
import "./adminMainPage.css";
import AdminSideBar from "../../AdminComponents/AdminSideBar/AdminSideBar";
import AdminNavBar from "../../AdminBavBar/AdminNavBar";

const AdminPage = () => {
  return (
    <>
      <AdminNavBar />
      <AdminSideBar />
    </>
  );
};

export default AdminPage;
