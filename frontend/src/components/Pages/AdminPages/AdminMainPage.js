import React from "react";
import "./adminMainPage.css";
import NavBar from "../../NavBar/NavBar";
import ModalBox from "../../ModalBox/ModalBox";
import AdminSideBar from "../../AdminComponents/AdminSideBar/AdminSideBar";
import AdminDashBoard from "../../AdminComponents/AdminDashBoard/AdminDashBoard";

const AdminPage = () => {
  return (
    <>
      <ModalBox />
      <NavBar />
      <AdminSideBar />
      <AdminDashBoard type={"main"} />
    </>
  );
};

export default AdminPage;
