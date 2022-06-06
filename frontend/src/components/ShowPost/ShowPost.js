import React, { useEffect, useState } from "react";
import "./showPost.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setSelector, setDispatch } from "react-redux";
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
  const getAllPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/post/friends", {
        headers: {
          Authorization: token,
        },
      });
      console.log(res);
      if (res.data.success) {
        dispatch(setAllPosts(res.data.result));
      }
    } catch {}
  };
  useEffect(() => {
    getAllPosts();
  });
  return (
    <div className="showsPostComponent">
      <div className="showPosts">
        <div className="postTop">
          <div className="postTopLeft">
            {/* post user img */}
            {/* post username */}
            {/* post date */}
          </div>
          <div className="postTopRight"></div>
          {/* settings icon */}
        </div>
        <div className="postCenter">
          {/* post text */}
          {/* post img */}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {/* icons for likes */}
            {/* likes counter */}
          </div>
          <div className="postBottomLeft">{/* comment counter */}</div>
        </div>
      </div>
    </div>
  );
};

export default ShowPost;
