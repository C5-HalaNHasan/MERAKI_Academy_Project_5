import React, { useEffect, useState } from "react";
import "./showPost.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setSelector, setDispatch } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";
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
  const [show, setShow] = useState(false);
  const [isReported, setIsReported] = useState(1);
  const [postText, setPostText] = useState("");
  const [postImg, setPostImg] = useState("");
  const [postVideo, setPostVideo] = useState("");
  const [updateClick,setUpdateClick]= useState(false);
  const [currentPost,setCurrentPost]=useState("")

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
        setShow(true);
      }
    } catch {}
  };
  const updatePost = (id) => {
    axios
      .put(
        `http://localhost:5000/post/${id}`,
        {
          postText,
          postImg,
          postVideo,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((result) => {
        dispatch(updatePosts({ id, postText, postImg, postVideo }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deletePostById = (id) => {
    axios
      .delete(` http://localhost:5000/post/${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((result) => {
        dispatch(removeFromPosts(id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const reportPostById = (id) => {
    axios
      .put(`http://localhost:5000/post/remove/${id}`)
      .then((result) => {
        dispatch(updatePosts({ id, isReported }));
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getAllPosts();
  }, []);
  return (
    <>
      <div className="showsPostComponent">
        {show &&
          posts.map((element, index) => {
            return (
              <div key={index} className="showPosts">
                <div className="postTop">
                  <div className="postTopLeft">
                    <img className="postUserImg" src={element.profileImg} />
                    <>{element.firstName} </> <span> {element.createdAt}</span>
                  </div>
                  <div className="postTopRight"></div>
                  <BsThreeDots className={element.id} onClick={(e)=>{
                    setUpdateClick(!updateClick)
                    setCurrentPost(e.target.className)
                    console.log(currentPost.animVal);

                  }} />
                  {currentUserInfo.id == element.author_id && updateClick && currentPost.animVal == element.id ? (
                    <>
                      {" "}
                      <input type={"text"} />
                      <input type={"file"} />
                      <button>Update</button>
                    </>
                  ) : (
                    ""
                  )}
                 {updateClick && currentPost.animVal == element.id? <p>Report</p>:""}
                </div>
                <div className="postCenter">
                  <>{element.postText}</>
                  <img src={element.postImg} />
                </div>
                <div className="postBottom">
                  <div className="postBottomLeft">
                    <AiOutlineLike />
                    {/* likes counter */}
                  </div>
                  <div className="postBottomLeft">{/* comment counter */}</div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ShowPost;
