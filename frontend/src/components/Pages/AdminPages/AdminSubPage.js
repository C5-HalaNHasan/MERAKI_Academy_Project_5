import React from "react";
import "./adminMainPage.css";
import NavBar from "../../NavBar/NavBar";
import { useParams } from "react-router-dom";
import ModalBox from "../../ModalBox/ModalBox";
import AdminSideBar from "../../AdminComponents/AdminSideBar/AdminSideBar";
import AdminDashBoard from "../../AdminComponents/AdminDashBoard/AdminDashBoard";
import AdminNavBar from "../../AdminBavBar/AdminNavBar";

const AdminSubPage = () => {
  const { type } = useParams();

  return (
    <>
      <ModalBox />
      <AdminNavBar />
      <AdminSideBar />
      <AdminDashBoard type={type} />
    </>
  );
};

export default AdminSubPage;
