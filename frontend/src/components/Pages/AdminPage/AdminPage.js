import React from "react";
import "./adminPage.css";
import NavBar from "../../NavBar/NavBar";
import { useSelector } from "react-redux";
import ModalBox from "../../ModalBox/ModalBox";
import AdminSideBar from "../../AdminComponent/AdminSideBar/AdminSideBar";
import AdminDashBoard from "../../AdminComponent/AdminDashBoard/AdminDashBoard";

const AdminPage = () => {
  const { userId } = useSelector((state) => {
    return {
      userId: state.user.userId,
    };
  });
  return (
    <>
      <ModalBox />
      <NavBar />
      <AdminSideBar />
      <AdminDashBoard />
    </>
  );
};

export default AdminPage;
