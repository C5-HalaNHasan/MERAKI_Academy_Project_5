import React from "react";
import "./adminPages.css";
import NavBar from "../../NavBar/NavBar";
import { useParams } from "react-router-dom";
import ModalBox from "../../ModalBox/ModalBox";
import AdminSideBar from "../../AdminComponents/AdminSideBar/AdminSideBar";
import AdminDashBoard from "../../AdminComponents/AdminDashBoard/AdminDashBoard";

const AdminSubPage = () => {
  const { type } = useParams();

  return (
    <>
      <ModalBox />
      <NavBar />
      <AdminSideBar />
      <AdminDashBoard type={type} />
    </>
  );
};

export default AdminSubPage;
