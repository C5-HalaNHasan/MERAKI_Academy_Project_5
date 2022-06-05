import React, { useEffect, useState } from "react";
import "./friendList.css";
import axios from "axios";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserFriends } from "../redux/reducers/user/index";

const FriendList = ({id}) => {
  //! FriendList component to be modified based on the following:
    //if id=userId: dispatch(userFriends({getAllFriendsByUserId from backend}))
    //if id!=userId: disptch(userFriends({getAllFriendsByUserId from backend}))
  const dispatch = useDispatch();
  const { token,userFriends,userId } = useSelector((state) => {
    return { 
      token: state.user.token, 
      userId: state.user.userId,
      userFriends:state.user.userFriends};
  });
  const navigate=useNavigate()
  const getAllFriends=async()=>{
      const response= await axios.get(`http://localhost:5000/user/friends/${userId}`,{
        headers:{
            Authorization:token
        } 
      }).then((response)=>{
        console.log(response.data.result); 
dispatch(setUserFriends(response.data.result))
      }).catch((err)=>{
        console.log(err);
      })

  }
  useEffect(()=>{
      getAllFriends()
  },[]);
  return (
  <div className="friendListComponent">
    friendListComponent
    <BiSearch/>
    {userFriends.map((friend,index)=>{
      return(
        <>
        <div key={index}>
          <img src={friend.profileImg} onClick={()=>{navigate("/user/:id")}}></img>
          <h4>{friend.firstName}</h4>
          </div></>
      )
    })}
    </div>);
};

export default FriendList;
//