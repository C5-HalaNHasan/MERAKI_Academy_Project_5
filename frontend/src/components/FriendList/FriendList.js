import React, { useEffect, useState } from "react";
import "./friendList.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUserFriends } from "../redux/reducers/user/index";
const FriendList = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => {
    return { token: state.user.token };
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [img, setImg] = useState("");
  const getAllFriends=async()=>{
      const response= await axios.get("http://localhost:5000/user/friends",{
        headers:{
            Authorization:token
        } 
      })
      console.log(response); 

  }
  useEffect(()=>{
      getAllFriends()
  },[])
  return <div className="friendListComponent">friendListComponent</div>;
};

export default FriendList;
