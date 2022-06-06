import React, { useEffect, useState } from "react";
import "./showPost.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setSelector, setDispatch } from "react-redux";
import {BsThreeDots} from "react-icons/bs"
import {AiOutlineLike} from "react-icons/ai"
import {
  setAllPosts,
  removeFromPosts,
  updatePosts,
  setAllComments,
  addToComments,
  removeFromComments,
  updateComments,
  setAllPostsReactions,
  addToPostsReactions,
  removeFromPostsReactions,
  setAllCommentsReactions,
  addToCommentsReactions,
  removeFromCommentsReactions,
} from "../redux/reducers/post";

const ShowPost = () => {
  const {
    currentUserInfo,
    token,
    posts,
    comments,
    postsReaction,
    commentsReactions,
  } = useSelector((state) => {
    return {
      currentUserInfo: state.user.currentUserInfo,
      token: state.user.token,
      posts: state.post.posts,
      comments: state.post.comments,
      postsReaction: state.post.postsReaction,
      commentsReactions: state.post.commentsReactions,
    };
  });
  const dispatch = useDispatch();
  const [show,setShow]=useState(false)
  const getAllPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/post/friends", {
        headers: {
          Authorization: token,
        },
      });
      
      if (res.data.success) {
        dispatch(setAllPosts(res.data.result));
        console.log(res.data.result);
        setShow(true)
      }
    } catch {}
  };
  useEffect(() => {
    getAllPosts();
  },[]);
  return ( 
    <>
  
   <div className="showsPostComponent">
   { show && posts.map((element,index)=>{
     return(
      <div key={index} className="showPosts">
        
        <div className="postTop">
          <div className="postTopLeft">
            <img className="postUserImg" src={element.profileImg}/>
            <>{element.firstName} </> <span> {element.createdAt}</span>
            
            
          </div>
          <div className="postTopRight"></div>
          <BsThreeDots/>
        </div>
        <div className="postCenter">
          <>{element.postText}</>
          <img src={element.postImg}/>
         
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <AiOutlineLike/>
            {/* likes counter */}
          </div>
          <div className="postBottomLeft">{/* comment counter */}</div>
        </div>
      </div> )})}
    </div>
    </>
  );
};

export default ShowPost;
