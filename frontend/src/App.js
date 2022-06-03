import "./App.css";
import {Routes,Route, Router} from "react-router-dom";
import LandingPage from "./components/Pages/LandingPage/LandingPage";
import HomePage from "./components/Pages/HomePage/HomePage";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import UserProfile from "./components/Pages/UserProfile/UserProfile";
import UpdateProfile from "./components/Pages/UpdateProfile/UpdateProfile";
import MessagePage from "./components/Pages/MessagePage/MessagePage";
import MessageWithPage from "./components/Pages/MessageWithPage/MessageWithPage";
import UsersPage from "./components/Pages/UsersPage/UsersPage";


function App() {
  return  (
    <div className="App">
      <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/home" element={<HomePage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/user/:id" element={<UserProfile/>}/>
      <Route path="/user/update/:id" element={<UpdateProfile/>}/>
      <Route path="/message" element={<MessagePage/>}/>
      <Route path="/message/:id" element={<MessageWithPage/>}/>
      <Route path="/users" element={<UsersPage/>}/>
      {/* admin dashboard route to be added */}
      </Routes>
    </div>
  );
}

export default App;
