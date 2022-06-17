import React, { useEffect, useState } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import "./modalBox.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ok from "../assets/ok.png";
import alert from "../assets/alert.png";
import notOk from "../assets/notOk.jpg";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { setModalBox } from "../redux/reducers/modalBox/index";
import { setCurrentUserInfo } from "../redux/reducers/user";
import previewPostImg from "../assets/fbLogo.png";

//! to update posts:
import {
  updatePosts,
  setAllPosts,
  removeFromPosts,
  updateComments,
  removeFromComments,
  setCommentCounter,
} from "../redux/reducers/post";

//! to rerender the inbox:
import { setAllMessages } from "../redux/reducers/message/index";

const ModalBox = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //to ensure that the user has entered enough charcters to send a message or report a user:
  const [enteredChar, setEnteredChar] = useState("");
  const [notification, setNotification] = useState("");
  //state to update profile images:
  const [updatedImg, setUpdatedImg] = useState("");
  const [previewImg, setPreviewImg] = useState("");
  //to show reported post in the admin dashboard
  const [reportedPostText, setReportedPostText] = useState("");
  const [reportedCommentText, setReportedCommentText] = useState("");

  const [reportedPostImg, setReportedPostImg] = useState("");

  //message states to be used to rerender the inbox:
  const { allMessages } = useSelector((state) => {
    return {
      allMessages: state.message.allMessages,
    };
  });

  //to update profile Info:
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [country, setCountry] = useState();
  const [birthday, setBirthday] = useState();

  //to use user token for axios calls
  const { token, userId, currentUserInfo } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
      currentUserInfo: state.user.currentUserInfo,
    };
  });
  //to use & set modalBox states:
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
  const actionTypes = [
    "ok",
    "notOk",
    "alert",
    "coverImg",
    "profileImg",
    // "updatePost",
    "deleteComment",
    "deletePost",
    "updateProfile",
    "deleteRoom",
    "showPost",
    "showComment",
  ];
  const clearModalBox = () => {
    dispatch(
      setModalBox({
        modalId: "",
        modalType: "",
        modalMessage: "",
        modalDetails: "",
        modalShow: false,
      })
    );
    setPreviewImg("");
    setUpdatedImg("");
    setReportedPostImg("");
    setReportedPostText("");
    setReportedCommentText("");
  };
  useEffect(() => {
    if (modalType === "showPost" && modalShow === true) {
      getReportedPost();
    }
    if (modalType === "showComment" && modalShow === true) {
      getReportedComment();
    }
  }, [modalId]);

  if (modalShow === false) {
    return null;
  }

  //! action buttons in ACTION COMPONENT:
  //a function to send messages to users:
  //!first open room==> from result get roomId then add the sent message with the room id to the database
  const sendMessage = () => {
    if (enteredChar.length > 1) {
      //! before sending message to the user: get room id or create on if not exists:
      let openRoomUrl = `https://warriors300-project5-backend.herokuapp.com/message/room/${modalId}`;
      axios
        .post(openRoomUrl, {}, { headers: { authorization: token } })
        .then((result) => {
          let roomId = result.data.result;
          let sendMessageToUserUrl = `https://warriors300-project5-backend.herokuapp.com/message/${modalId}`;
          if (enteredChar.length > 10) {
            axios
              .post(
                sendMessageToUserUrl,
                { message: enteredChar, room: roomId },
                { headers: { authorization: token } }
              )
              .then((result1) => {
                if (result1.data.success) {
                  clearModalBox();
                }
              })
              .catch((error1) => {
                console.log({ fromSendMessage_error: error1 });
              });
          }
        })
        .catch((error) => {});
    } else {
      setNotification("at least 30 characters must be provided!");
    }

    clearModalBox();
  };

  //a function to report  users with only if reasons are provided:
  const reportUser = () => {
    let reportUserUrl = `https://warriors300-project5-backend.herokuapp.com/user/remove/${modalId}`;
    if (enteredChar.length > 10) {
      axios
        .put(reportUserUrl, {}, { headers: { authorization: token } })
        .then((result) => {
          if (result.data.success) {
            clearModalBox();
          }
        })
        .catch((error) => {
          console.log({ fromReportUser_error: error });
        });
    } else {
    }
  };
  // a function that gets currentUserInfo sothat the cover & profile photos will be directly shown when modal box is closed:
  const getCurrentUserInfo = () => {
    let getCurrentUserInfoUrl = `https://warriors300-project5-backend.herokuapp.com/user/${userId}`;
    axios
      .get(getCurrentUserInfoUrl, { headers: { Authorization: token } })
      .then((result) => {
        if (result.data.success) {
          dispatch(setCurrentUserInfo(result.data.result[0]));
        }
      })
      .catch((error) => {
        console.log({ error_from_getUserInfo: error });
      });
  };

  //! a function to update current user profile:
  const updateProfile = async () => {
    let userData = {
      firstName,
      lastName,
      password,
      country,
      birthday,
    };
    let updateProfileUrl = `https://warriors300-project5-backend.herokuapp.com/user`;
    await axios
      .put(updateProfileUrl, userData, { headers: { authorization: token } })
      .then(async (result) => {
        if (result.data.success) {
          dispatch(setCurrentUserInfo(result.data.result[0]));
          getCurrentUserInfo();
          clearModalBox();
        }
      })
      .catch((error) => {
        console.log({ error_from_updateuserProfile: error });
      });
  };
  //!
  //! update profile & cover photos from here
  //a function that updates currentUser profileImg OR cover Img:
  const changeUserImgs = (e) => {
    setUpdatedImg(e.target.files[0]);
    const data = new FormData();
    data.append("file", e.target.files[0]);
    data.append("upload_preset", "rapulojk");
    data.append("cloud_name", "difjgm3tp");
    let uploadPicUrl = "https://api.cloudinary.com/v1_1/difjgm3tp/image/upload";
    axios
      .post(uploadPicUrl, data)
      .then((result) => {
        setUpdatedImg(result.data.url);
        setPreviewImg(result.data.url);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateUserImgs = () => {
    let updateImgUrl = `https://warriors300-project5-backend.herokuapp.com/user`;
    let update = modalType == "profileImg" ? "profileImg" : "coverImg";
    axios
      .put(
        updateImgUrl,
        { [modalType]: updatedImg },
        { headers: { authorization: token } }
      )
      .then((result) => {
        if (result.data.success) {
          getCurrentUserInfo();
          clearModalBox();
        }
      })
      .catch((error) => {
        console.log({ error_from_updatedProfileImgs: error });
      });
  };
  //! till here
  //! updated image to be set wheneve the user uploads a photo

  //! to handle posts edit:(as per show post component):
  const getAllPosts = async () => {
    try {
      const res = await axios.get(
        ` https://warriors300-project5-backend.herokuapp.com/post/user/${userId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (res.data.success) {
        dispatch(setAllPosts(res.data.result));
      }
    } catch {}
  };

  //upload post photo to cloudinary
  const changePostImg = (e) => {
    setUpdatedImg(e.target.files[0]);
    const data = new FormData();
    data.append("file", e.target.files[0]);
    data.append("upload_preset", "rapulojk");
    data.append("cloud_name", "difjgm3tp");
    let uploadPicUrl = "https://api.cloudinary.com/v1_1/difjgm3tp/image/upload";
    axios
      .post(uploadPicUrl, data)
      .then((result) => {
        setUpdatedImg(result.data.url);
        setPreviewImg(result.data.url);
        dispatch(setModalBox({ modalDetails: result.data.url }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //updatePost function:
  const updatePost = () => {
    axios
      .put(
        `https://warriors300-project5-backend.herokuapp.com/post/${modalId}`,
        {
          postText: enteredChar,
          postImg: updatedImg,
          // postVideo,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((result) => {
        dispatch(
          updatePosts({
            id: modalId,
            postText: enteredChar,
            postImg: updatedImg,
            // postVideo,
          })
        );
        clearModalBox();
        setPreviewImg("");
        setUpdatedImg("");
        getAllPosts();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateComment = () => {
    axios
      .put(
        `https://warriors300-project5-backend.herokuapp.com/comment/${modalId}`,
        {
          comment: enteredChar,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((result) => {
        dispatch(
          updateComments({
            id: modalId,
            comment: enteredChar,
          })
        );
        getAllPosts();
        clearModalBox();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //deletePost function:
  const deletePost = () => {
    axios
      .delete(` https://warriors300-project5-backend.herokuapp.com/post/${modalId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((result) => {
        dispatch(removeFromPosts(modalId));
        clearModalBox();
        getAllPosts();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // new delete comment function
  const deleteComment = () => {
    axios
      .delete(`https://warriors300-project5-backend.herokuapp.com/comment/${modalId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((result) => {
        dispatch(removeFromComments(modalId));
        clearModalBox();
        getAllPosts();
        getCounterNumber();
      })
      .catch((error) => {});
  };
  const getCounterNumber = () => {
    axios
      .get("https://warriors300-project5-backend.herokuapp.com/comment/")
      .then((result) => {
        dispatch(setCommentCounter(result.data.commentCounter));
        getAllPosts();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //a function that will be dispatched from the admin dashBoard: //!
  //since this action (showPost) requires the post photo to be viewed;it will be invoked when the moalType==showPost:
  const getReportedPost = async () => {
    try {
      const res = await axios.get(`https://warriors300-project5-backend.herokuapp.com/post`, {
        headers: {
          Authorization: token,
        },
      });
      if (res.data.success) {
        let filtForReported = res.data.result.filter((post) => {
          return post.id == modalId;
        });
        setReportedPostImg(filtForReported[0].postImg);
        setReportedPostText(filtForReported[0].postText);
      }
    } catch {}
  };
  const getReportedComment = async () => {
    try {
      const res = await axios.get(
        `https://warriors300-project5-backend.herokuapp.com/comment/id/${modalId}`
      );
      if (res.data.success) {
        setReportedCommentText(res.data.result[0].comment);
      }
    } catch {}
  };

  // if (modalType == "showPost") {
  //   getReportedPost();
  // }
  //a function that rerenders the inbox after the room is deleted:
  const getAllMessages = () => {
    let getMessagesUrl = `https://warriors300-project5-backend.herokuapp.com/message/get/user/room`;
    axios
      .get(getMessagesUrl, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.result.length) {
          dispatch(setAllMessages(result.data.result));
        }
      })
      .catch((error) => {});
  };
  //a function that eletes the room between two users:
  const deleteRoom = () => {
    let removeRoomUrl = `https://warriors300-project5-backend.herokuapp.com/message/room/${modalId}`;
    axios
      .put(removeRoomUrl, {}, { headers: { authorization: token } })
      .then((result) => {
        clearModalBox();
        getAllMessages();
      })
      .catch((error) => {
        console.log({ removeRoome_error: error });
      });
  };

  return (
    <div className="modalBox">
      <div className="contentsContainer">
        {/* TOP TITLE STARTS HERE */}
        <div className="boxMessage">
          <h3>{modalMessage}</h3>
          <AiOutlineCloseCircle
            className="closeModalBox"
            onClick={() => {
              clearModalBox();
            }}
          />
        </div>
        {/* TOP TITLE ENDS HERE */}

        {/* PHOTOS DIV STARTS HERE */}
        <div className="modalPhoto">
          {modalType === "ok" && <img src={ok} alt="ok" />}
          {modalType === "notOk" && <img src={notOk} alt="notOk" />}
          {modalType === "alert" && <img src={alert} alt="alert" />}
          {modalType === "deletePost" && <img src={alert} alt="alert" />}
          {modalType === "deleteComment" && <img src={alert} alt="alert" />}
          {modalType == "deleteRoom" && <img src={alert} alt="alert" />}

          {/* IMAGE TO BE CHECKED SINCE MODAL IS NOT CLEARED WHEN TRYING TO MODIFY ANOTHER POST WITHOUT IMAGE*/}
          {modalType === "updatePost" && (
            <img
              src={modalDetails ? modalDetails : previewPostImg}
              alt="post img"
            />
          )}
          {modalType === "showPost" && (
            <img
              src={reportedPostImg ? reportedPostImg : previewPostImg}
              alt="post img"
            />
          )}
          {modalType === "updateComment" && (
            <img src={previewPostImg} alt="alert" />
          )}
          {modalType === "profileImg" && (
            <img
              src={previewImg ? previewImg : currentUserInfo.profileImg}
              alt="profileImg"
            />
          )}
          {modalType === "coverImg" && (
            <img
              src={previewImg ? previewImg : currentUserInfo.coverImg}
              alt="profileImg"
            />
          )}
        </div>
        {/* PHOTOS DIV ENDS HERE */}

        <div className="modalBottom">
          {/* BOx CONTENT STARTS HERE */}
          <div className="boxContent">
            {/* add details whenevr a backend sends an error */}
            {modalType == "ok" ||
            modalType == "notOk" ||
            modalType == "alert" ||
            modalType == "deletePost" ||
            modalType == "deleteComment" ||
            modalType == "deleteRoom" ? (
              <h2>{modalDetails}</h2>
            ) : null}
            {/* add details whenevr a backend sends an error */}
            {modalType == "showPost" && <h2>{reportedPostText}</h2>}
            {modalType == "showComment" && <h2>{reportedCommentText}</h2>}

            {actionTypes.includes(modalType) && (
              <>
                <div className="actionButtonsContainer">
                  {/* start of  update profile & cover images */}
                  {modalType === "profileImg" && (
                    <>
                      <label for="upload1">
                        <HiOutlinePhotograph className="modalBoxIcon"></HiOutlinePhotograph>
                      </label>
                      <input
                        type="file"
                        onChange={changeUserImgs}
                        id="upload1"
                        style={{ display: "none" }}
                      ></input>
                    </>
                  )}

                  {modalType === "coverImg" && (
                    <>
                      <label for="upload2">
                        <HiOutlinePhotograph className="modalBoxIcon"></HiOutlinePhotograph>
                      </label>
                      <input
                        type="file"
                        onChange={changeUserImgs}
                        id="upload2"
                        style={{ display: "none" }}
                      ></input>
                    </>
                  )}

                  {/* end of  update profile & cover images & post images */}
                  {modalType !== "coverImg" &&
                    modalType !== "profileImg" &&
                    modalType !== "updatePost" &&
                    modalType !== "deletePost" &&
                    modalType !== "deleteComment" &&
                    modalType !== "updateProfile" &&
                    modalType !== "deleteRoom" && (
                      <button
                        className="actionButton"
                        onClick={() => clearModalBox()}
                      >
                        Ok
                      </button>
                    )}
                  {modalType == "coverImg" && (
                    <button
                      className="actionButton"
                      onClick={() => updateUserImgs()}
                    >
                      Update
                    </button>
                  )}
                  {modalType == "profileImg" && (
                    <button
                      className="actionButton"
                      onClick={() => updateUserImgs()}
                    >
                      Update
                    </button>
                  )}

                  {modalType == "deletePost" && (
                    <button
                      className="actionButton"
                      onClick={() => deletePost()}
                    >
                      Delete
                    </button>
                  )}
                  {modalType == "deleteComment" && (
                    <button
                      className="actionButton"
                      onClick={() => deleteComment()}
                    >
                      Delete
                    </button>
                  )}
                  {modalType == "deleteRoom" && (
                    <button
                      className="actionButton"
                      onClick={() => deleteRoom()}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
            {/* end of the big condition actionTypes */}

            {/* a state is going to be used to count the letters to ensure that it's filled */}
            {/* update post box and button start here */}
            {modalType == "updateComment" && (
              <div className="boxContent">
                <textarea
                  placeholder="Write your updated here..."
                  onChange={(e) => setEnteredChar(e.target.value)}
                />{" "}
                <div className="actionButtonsContainer">
                  <button
                    className="actionButton"
                    onClick={() => updateComment()}
                  >
                    Update
                  </button>
                </div>
              </div>
            )}
            {modalType == "updatePost" && (
              <div className="boxContent">
                <textarea
                  placeholder="Write your updated post here..."
                  onChange={(e) => setEnteredChar(e.target.value)}
                />
                <div className="actionButtonsContainer">
                  <label for="upload3">
                    <HiOutlinePhotograph className="modalBoxIcon"></HiOutlinePhotograph>
                  </label>
                  <input
                    type="file"
                    onChange={changePostImg}
                    id="upload3"
                    style={{ display: "none" }}
                  ></input>

                  <button className="actionButton" onClick={() => updatePost()}>
                    Update
                  </button>
                </div>
              </div>
            )}
            {/* update post box and button ends here */}

            {/* send message box and button start here */}
            {modalType == "sendMessage" && (
              <div className="boxContent">
                <textarea
                  placeholder="Write your message here..."
                  onChange={(e) => setEnteredChar(e.target.value)}
                />
                <div className="actionButtonsContainer">
                  <button
                    className="actionButton"
                    onClick={() => sendMessage()}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
            {/* send message box and button end here */}

            {/* report user box and button starts here */}
            {modalType == "report" && (
              <div className="boxContent">
                <textarea
                  placeholder="Write your reaseons here..."
                  onChange={(e) => setEnteredChar(e.target.value)}
                />
                <div className="actionButtonsContainer">
                  <button className="actionButton" onClick={() => reportUser()}>
                    Report
                  </button>
                </div>
              </div>
            )}
            {/* report user box and button ends here */}
          </div>
          {/* BOx CONTENT ENDS HERE (DIV ABOVE)*/}
          {/* UPDATE PROFILE STARTS HERE (DIV BELOW)*/}
          {modalType == "updateProfile" && (
            <>
              <div className="modalUpdateProfile">
                <div className="loginBox">
                  <div className="inputField">
                    <label>First Name:</label>
                    <input
                      type="text"
                      placeholder="First Name..."
                      name="firstName"
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="off"
                    ></input>
                  </div>
                  <div className="inputField">
                    <label>Last Name:</label>
                    <input
                      type="text"
                      placeholder="Last Name..."
                      name="lastName"
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="off"
                    ></input>
                  </div>

                  <div className="inputField">
                    <label>Birthday:</label>
                    <input
                      type="date"
                      placeholder="Birthday..."
                      name="birthday"
                      onChange={(e) => setBirthday(e.target.value)}
                      autoComplete="off"
                    ></input>
                  </div>

                  <div className="inputField">
                    <label>Country:</label>
                    <input
                      type="text"
                      placeholder="Country..."
                      name="country"
                      onChange={(e) => setCountry(e.target.value)}
                      autoComplete="off"
                    ></input>
                  </div>

                  <div className="inputField">
                    <label>Password:</label>
                    <input
                      type="password"
                      placeholder="Password..."
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="off"
                    ></input>
                  </div>
                  <div className="actionButtonsContainer">
                    <button
                      className="actionButton"
                      onClick={() => {
                        updateProfile();
                      }}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* UPDATE PROFILE ENDS HERE (first DIV ABOVE)*/}
        </div>
      </div>
    </div>
  );
};

export default ModalBox;
