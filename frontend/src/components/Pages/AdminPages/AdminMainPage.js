import React from "react";
import "./adminMainPage.css";
import NavBar from "../../NavBar/NavBar";
import ModalBox from "../../ModalBox/ModalBox";
import AdminSideBar from "../../AdminComponents/AdminSideBar/AdminSideBar";
import AdminDashBoard from "../../AdminComponents/AdminDashBoard/AdminDashBoard";
import AdminNavBar from "../../AdminBavBar/AdminNavBar";

const AdminPage = () => {
  return (
    <>
      {/* <ModalBox /> */}
      <AdminNavBar />
      <AdminSideBar />
      {/* <AdminDashBoard type={"main"} /> */}
    </>
  );
};

export default AdminPage;
