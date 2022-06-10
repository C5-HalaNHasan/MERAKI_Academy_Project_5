import "./App.css";
import React from "react";
import { Routes, Route, Router } from "react-router-dom";
import LandingPage from "./components/Pages/LandingPage/LandingPage";
import HomePage from "./components/Pages/HomePage/HomePage";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import UserProfilePage from "./components/Pages/UserProfilePage/UserProfilePage";
import UpdateProfilePage from "./components/Pages/UpdateProfilePage/UpdateProfilePage";
import MessagePage from "./components/Pages/MessagePage/MessagePage";
import MessageWithPage from "./components/Pages/MessageWithPage/MessageWithPage";
import UsersPage from "./components/Pages/UsersPage/UsersPage";
import AdminMainPage from "./components/Pages/AdminPages/AdminMainPage";
import AdminSubPage from "./components/Pages/AdminPages/AdminSubPage";

function App() {
  return (
    <div className="componentsContainer">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/:id" element={<UserProfilePage />} />
        <Route path="/user/update/:id" element={<UpdateProfilePage />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/message/:id" element={<MessageWithPage />} />
        <Route path="/users/:type/:name" element={<UsersPage />} />
        <Route path="/admin" element={<AdminMainPage />} />
        <Route path="/admin/:type" element={<AdminSubPage />} />
      </Routes>
    </div>
  );
}

export default App;
