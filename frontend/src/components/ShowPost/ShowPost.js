import React, { useEffect, useState } from "react";
import "./showPost.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { BsThreeDots } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
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
  setCommentCounter,
  setReactionCounter,
  setCommentReactionCounter,
} from "../redux/reducers/post";

import { setModalBox } from "../redux/reducers/modalBox/index";

const ShowPost = ({ type, id }) => {
  //! modalBox states:
  const {
    modalId,
    modalType,
    modalMessage,
    modalDetails,
    modalShow,
  } = useSelector((state) => {
    return {
      modalId: state.modalBox.modalId,
      modalType: state.modalBox.modalType,
      modalMessage: state.modalBox.modalMessage,
      modalDetails: state.modalBox.modalDetails,
      modalShow: state.modalBox.modalShow,
    };
  });

  const {
    currentUserInfo,
    token,
    posts,
    comments,
    postsReaction,
    commentsReactions,
    reactionCounter,
    commentCounter,
    commentReactionsCounter,
  } = useSelector((state) => {
    return {
      currentUserInfo: state.user.currentUserInfo,
      token: state.user.token,
      posts: state.post.posts,
      comments: state.post.comments,
      postsReaction: state.post.postsReaction,
      commentsReactions: state.post.commentsReactions,
      commentCounter: state.post.commentCounter,
      reactionCounter: state.post.reactionCounter,
      commentReactionsCounter: state.post.commentReactionsCounter,
    };
  });
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [isReported, setIsReported] = useState(1);
  const [postText, setPostText] = useState("");
  const [postImg, setPostImg] = useState("");
  const [postVideo, setPostVideo] = useState("");
  const [updateClick, setUpdateClick] = useState(false);
  const [updateClickComment, setUpdateClickComment] = useState(false);
  const [currentPost, setCurrentPost] = useState("");
  const [currentComment, setCurrentComment] = useState("");
  const [comment, setComment] = useState("");
  const [newComment, setNewComment] = useState("");
  const [clear, setClear] = useState();
  const [showComments, setShowComments] = useState(false);
  const [postId, setPostId] = useState("");
  const [likeColor, setLikeColor] = useState(false);
  const author = currentUserInfo.id;
  let getAllPosts;
  if (type == "home") {
    getAllPosts = async () => {
      try {
        const res = await axios.get("https://warriors300-project5-backend.herokuapp.com/post/friends", {
          headers: {
            Authorization: token,
          },
        });

        if (res.data.success) {
          dispatch(setAllPosts(res.data.result));

          setShow(true);
        }
      } catch {}
    };
  } else if (id != undefined) {
    getAllPosts = async () => {
      try {
        const res = await axios.get(` https://warriors300-project5-backend.herokuapp.com/post/user/${id}`, {
          headers: {
            Authorization: token,
          },
        });

        if (res.data.success) {
          dispatch(setAllPosts(res.data.result));
          setShow(true);
        }
      } catch {}
    };
  }

  //new updatePost function:
  const updatePost = (id, postImg) => {
    dispatch(
      setModalBox({
        modalId: id,
        modalType: "updatePost",
        modalMessage: "Update Post",
        modalDetails: postImg,
        modalShow: true,
      })
    );
  };

  //new deletePost function:
  const deletePostById = (id) => {
    dispatch(
      setModalBox({
        modalId: id,
        modalType: "deletePost",
        modalMessage: "Delete Post",
        modalDetails: "Do you want to delete this post?",
        modalShow: true,
      })
    );
  };
  // new update comment function
  const updateComment = (id) => {
    dispatch(
      setModalBox({
        modalId: id,
        modalType: "updateComment",
        modalMessage: "Update Comment",
        modalShow: true,
      })
    );
  };

  // new delete comment func
  const deleteCommentById = (id) => {
    dispatch(
      setModalBox({
        modalId: id,
        modalType: "deleteComment",
        modalMessage: "Delete Comment",
        modalDetails: "Do you want to delete this comment?",
        modalShow: true,
      })
    );
  };
  const reportPostById = (id) => {
    axios
      .put(`https://warriors300-project5-backend.herokuapp.com/post/remove/${id}`)
      .then((result) => {
        dispatch(updatePosts({ id, isReported }));
      })
      .catch((error) => {});
  };
  const addComment = (id) => {
    axios
      .post(
        `https://warriors300-project5-backend.herokuapp.com/comment/post/${id}`,
        {
          comment,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((result) => {
        dispatch(addToComments(comment));
        getAllPosts();

        getCounterNumber();
      })
      .catch((error) => {});
  };

  const reportCommentById = (id) => {
    axios
      .put(`https://warriors300-project5-backend.herokuapp.com/comment/remove/${id}`)
      .then((res) => {})
      .catch((error) => {
        dispatch(updateComments({ id, isReported }));
      });
  };
  const getCounterNumber = () => {
    axios
      .get("https://warriors300-project5-backend.herokuapp.com/comment/")
      .then((result) => {
        dispatch(setCommentCounter(result.data.commentCounter));
        dispatch(setReactionCounter(result.data.reactionCounter));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getCommentReactionsCount = () => {
    axios
      .get(`https://warriors300-project5-backend.herokuapp.com/reaction/comment/counter`, {
        headers: {
          Authorization: token,
        },
      })
      .then((result) => {
        dispatch(setCommentReactionCounter(result.data.result));
      })
      .catch((error) => {});
  };
  const addReactionToPost = async (id) => {
    await axios
      .post(
        `https://warriors300-project5-backend.herokuapp.com/reaction/post/${id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((result) => {
        getCounterNumber();
        getAllPostsReactions();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const removeReactionFromPost = async (id) => {
    await axios
      .delete(`https://warriors300-project5-backend.herokuapp.com/reaction/post/${id} `, {
        headers: {
          Authorization: token,
        },
      })
      .then((result) => {
        getCounterNumber();
      })
      .catch((error) => {});
  };
  const getAllPostsReactions = () => {
    axios
      .get("https://warriors300-project5-backend.herokuapp.com/reaction/post", {
        headers: {
          Authorization: token,
        },
      })
      .then((result) => {
        dispatch(setAllPostsReactions(result.data.result));
      })
      .catch((error) => {});
  };

  const checkIfLiked = (post, author) => {
    if (postsReaction.length == 0) {
      return addReactionToPost(post);
    }
    postsReaction.map((element, index) => {
      if (
        element.author_id == author &&
        element.post_id == post &&
        element.isDeleted == 0
      ) {
        return removeReactionFromPost(post);
      }
    });
    return addReactionToPost(post);
  };

  const getAllCommentsReactions = () => {
    axios
      .get("https://warriors300-project5-backend.herokuapp.com/reaction/comment", {
        headers: {
          Authorization: token,
        },
      })
      .then((result) => {
        dispatch(setAllCommentsReactions(result.data.result));
      })
      .catch((error) => {});
  };
  const addReactionToComment = (id) => {
    axios
      .post(
        `https://warriors300-project5-backend.herokuapp.com/reaction/comment/${id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((result) => {
        getCommentReactionsCount();
        getAllCommentsReactions();
      })
      .catch((error) => {});
  };
  const removeReactionFromComment = (id) => {
    axios
      .delete(`https://warriors300-project5-backend.herokuapp.com/reaction/comment/${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((result) => {
        getCommentReactionsCount();
        getAllCommentsReactions();
      })
      .catch((error) => {});
  };
  const checkCommentsLiked = (comment, author) => {
    if (commentsReactions.length == 0) {
      return addReactionToComment(comment);
    }
    commentsReactions.map((element, index) => {
      if (
        element.author_id == author &&
        element.comment_id == comment &&
        element.isDeleted == 0
      ) {
        return removeReactionFromComment(comment);
      }
    });

    return addReactionToComment(comment);
  };

  useEffect(() => {
    getAllPosts();
    getCounterNumber();
    getAllPostsReactions();
    getCommentReactionsCount();
    getAllCommentsReactions();
  }, []);
  return (
    <>
      <div className="showsPostComponent">
        {show &&
          posts &&
          posts.map((element, index) => {
            return (
              <div key={index} className="showPosts">
                <div className="postTop">
                  <div className="postTopLeft">
                    <div>
                      <img className="postUserImg" src={element.profileImg} />
                    </div>
                    <div className="nameAndDate">
                      <div className="name">
                        {element.firstName} {element.lastName}
                      </div>{" "}
                      <span className="date">
                        {" "}
                        {element.createdAt
                          ? element.createdAt.split("T")[0]
                          : ""}
                        <br></br>
                        {element.createdAt
                          ? element.createdAt.split("T")[1].replace(".000Z", "")
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="postTopRight"></div>
                  <BsThreeDots
                    className="settingBtn"
                    id={element.id}
                    onClick={(e) => {
                      setUpdateClick(!updateClick);
                      setCurrentPost(e.target.id);
                    }}
                  />
                  {currentUserInfo.id == element.author_id &&
                  updateClick &&
                  currentPost == element.id ? (
                    <>
                      <div>
                        <div className="btnStyling">
                          <button
                            className="updateBtn"
                            id={element.id}
                            onClick={(e) => {
                              {
                                updatePost(element.id, element.postImg);
                                setUpdateClick(false);
                              }
                            }}
                          >
                            Update
                          </button>

                          <button
                            className="deleteBtn"
                            onClick={() => {
                              deletePostById(element.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  {updateClick &&
                  currentPost == element.id &&
                  author !== element.author_id ? (
                    <p
                      className="report"
                      onClick={() => {
                        reportPostById(element.id);
                        setUpdateClick(false);
                      }}
                    >
                      Report
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="postCenter">
                  <p className="postText">{element.postText}</p>
                  <br></br>
                  {element.postImg ? (
                    <img className="PostImg" src={element.postImg} />
                  ) : (
                    ""
                  )}
                </div>
                <div className="postBottom">
                  <div>
                    <AiOutlineLike
                      className={element.isLiked ? "liked" : "likeColor"}
                      onClick={() => {
                        checkIfLiked(element.id, currentUserInfo.id);
                        getAllPosts();
                      }}
                    />

                    {false
                      ? element.reacts.map((react, ind) => {
                          return (
                            <>
                              {react.author_id == currentUserInfo.id ? (
                                <AiOutlineLike
                                  className="liked"
                                  onClick={() => {
                                    checkIfLiked(
                                      element.id,
                                      currentUserInfo.id
                                    );
                                  }}
                                />
                              ) : (
                                <AiOutlineLike
                                  className=""
                                  onClick={() => {
                                    checkIfLiked(
                                      element.id,
                                      currentUserInfo.id
                                    );
                                  }}
                                />
                              )}
                            </>
                          );
                        })
                      : ""}

                    {reactionCounter &&
                      reactionCounter.map((count, ind) => {
                        return (
                          <>
                            {count.id == element.id ? (
                              <>{count["COUNT(distinct post_reaction.id)"]}</>
                            ) : (
                              ""
                            )}
                          </>
                        );
                      })}
                    <span className={element.isLiked ? "likedTags" : "tags"}>
                      {" "}
                      Like
                    </span>
                  </div>
                  <div>
                    <BiComment
                      className="commentIcon"
                      id={element.id}
                      onClick={(e) => {
                        setShowComments(!showComments);
                        setPostId(e.target.id);
                      }}
                    />
                    {commentCounter &&
                      commentCounter.map((count, ind) => {
                        return (
                          <>
                            {count.id == element.id ? (
                              <>{count["count(distinct comment.id)"]}</>
                            ) : (
                              ""
                            )}
                          </>
                        );
                      })}
                    <span className="tags"> Comment</span>
                  </div>
                </div>
                {showComments && postId == element.id ? (
                  <>
                    <div className="comments">
                      {element.comments ? (
                        element.comments.map((comment, i) => {
                          return (
                            <div className="commentsDet">
                              <div className="commenterPicAndName">
                                <div className="displayCont">
                                  <div>
                                    <img
                                      className="commenterPic"
                                      src={comment.profileImg}
                                    />
                                  </div>
                                  <div className="mainComment">
                                    <div className="commenterNameAndPost">
                                      <div className="commenterName">
                                        {comment.firstName} {comment.lastName}
                                      </div>{" "}
                                      <div className="userComment">
                                        <p className="comment" key={i}>
                                          {comment.comment}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="dateAndLike">
                                      <div className="createdTime">
                                        {comment.createdAt
                                          ? comment.createdAt.split("T")[0]
                                          : ""}
                                        <br></br>
                                        {comment.createdAt
                                          ? comment.createdAt
                                              .split("T")[1]
                                              .replace(".000Z", "")
                                          : ""}
                                      </div>
                                      <div>
                                        <AiOutlineLike
                                          className={
                                            comment.isLikedComment
                                              ? "commentLiked"
                                              : "commentNotLiked"
                                          }
                                          onClick={() => {
                                            checkCommentsLiked(
                                              comment.id,
                                              currentUserInfo.id
                                            );
                                            getAllPosts();
                                          }}
                                        />
                                        {commentReactionsCounter &&
                                          commentReactionsCounter.map(
                                            (count, ind) => {
                                              return (
                                                <>
                                                  {count.id == comment.id ? (
                                                    <>
                                                      {
                                                        count[
                                                          "COUNT(distinct comment_reaction.id)"
                                                        ]
                                                      }
                                                    </>
                                                  ) : (
                                                    ""
                                                  )}
                                                </>
                                              );
                                            }
                                          )}
                                        <span
                                          className={
                                            element.isLikedComment
                                              ? "likedTagsComment"
                                              : "tagsComment"
                                          }
                                        >
                                          {" "}
                                          Like
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="settingComments">
                                  <BsThreeDots
                                    className="settingBtn"
                                    id={comment.id}
                                    onClick={(e) => {
                                      setUpdateClickComment(
                                        !updateClickComment
                                      );
                                      setCurrentComment(e.target.id);
                                    }}
                                  />
                                  {currentUserInfo.id == comment.author_id &&
                                  updateClickComment &&
                                  currentComment == comment.id ? (
                                    <>
                                      <div className="btnStyling">
                                        <button
                                          className="updateBtn"
                                          id={element.id}
                                          onClick={(e) => {
                                            {
                                              updateComment(comment.id);
                                              setClear("");
                                            }
                                          }}
                                        >
                                          Update
                                        </button>
                                        <button
                                          className="deleteBtn"
                                          onClick={() => {
                                            deleteCommentById(comment.id);
                                          }}
                                        >
                                          delete
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                  {updateClickComment &&
                                  currentComment == comment.id &&
                                  author !== comment.author_id ? (
                                    <p
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        reportCommentById(comment.id);
                                      }}
                                    >
                                      Report
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>

                              <div></div>
                            </div>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </div>
                    <div>
                      <textarea
                        value={clear}
                        className="commentBox"
                        placeholder="Write a comment..."
                        onClick={() => {
                          setClear();
                        }}
                        onChange={(e) => {
                          setComment(e.target.value);
                        }}
                      />
                      <button
                        id={element.id}
                        className="commentBtn"
                        onClick={(e) => {
                          addComment(e.target.id);
                          setClear("");
                        }}
                      >
                        Add comment
                      </button>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ShowPost;
