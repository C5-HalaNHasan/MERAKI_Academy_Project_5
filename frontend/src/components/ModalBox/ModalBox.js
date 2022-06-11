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
import previewPostImg from "../assets/bgReg.jpg";
//! to update posts:
import { updatePosts, setAllPosts } from "../redux/reducers/post";

const ModalBox = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //to ensure that the user has entered enough charcters to send a message or report a user:
  const [enteredChar, setEnteredChar] = useState("");
  const [notification, setNotification] = useState("");
  //state to update profile images:
  const [updatedImg, setUpdatedImg] = useState("");
  const [previewImg, setPreviewImg] = useState("");

  //to use user token for axios calls
  const { token, userId, currentUserInfo } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
      currentUserInfo: state.user.currentUserInfo,
    };
  });
  //to use & set modalBox states:
  const { modalId, modalType, modalMessage, modalDetails, modalShow } =
    useSelector((state) => {
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
    "updatePost",
    "updateComment",
    "updateProfile",
  ];
  // const actionTypes = ["ok", "notOk", "alert", "coverImg", "profileImg"];

  if (modalShow === false) {
    return null;
  }

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
  };
  //! action buttons:
  //a function to send messages to users:
  const sendMessage = () => {
    let sendMessageToUserUrl = `http://localhost:5000/message/${modalId}`;
    if (enteredChar.length > 10) {
      axios
        .post(
          sendMessageToUserUrl,
          { message: enteredChar },
          { headers: { authorization: token } }
        )
        .then((result) => {
          if (result.data.success) {
            console.log({ fromSendMessage_result: result });
            clearModalBox();
            //!toast notification to be added "message sent successfully"
          }
        })
        .catch((error) => {
          console.log({ fromSendMessage_error: error }); //! to be deleted and replaced by toast notification
        });
    } else {
      setNotification("at least 30 characters must be entered!"); //! by toast
    }
  };

  //a function to report  users with only if reasons are provided:
  const reportUser = () => {
    let reportUserUrl = `http://localhost:5000/user/remove/${modalId}`;
    if (enteredChar.length > 10) {
      axios
        .put(reportUserUrl, {}, { headers: { authorization: token } })
        .then((result) => {
          if (result.data.success) {
            console.log({ fromReportUser_result: result });
            clearModalBox();
            //!toast notification to be added "reported successfully"
          }
        })
        .catch((error) => {
          console.log({ fromReportUser_error: error }); //! to be deleted and replaced by toast notification
        });
    } else {
      setNotification("at least 30 characters must be provided!");
    }
  };

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
        console.log(result.data.url);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateUserImgs = () => {
    let updateImgUrl = `http://localhost:5000/user`;
    let update = modalType == "profileImg" ? "profileImg" : "coverImg";
    axios
      .put(
        updateImgUrl,
        { [modalType]: updatedImg },
        { headers: { authorization: token } }
      )
      .then((result) => {
        if (result.data.success) {
          console.log("updated successfully");
          setCurrentUserInfo(result.data.result);
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
        ` http://localhost:5000/post/user/${userId}`,
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
        console.log(result.data.url);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //updatePost
  //! new updatePost function:
  const updatePost = () => {
    axios
      .put(
        `http://localhost:5000/post/${modalId}`,
        {
          postText: enteredChar,
          postImg: updatedImg,
          // postVideo, //! to be checked
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
            // postVideo, //! to be checked
          })
        );
        clearModalBox();
        getAllPosts();
      })
      .catch((error) => {
        console.log(error);
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
          {modalType === "updatePost" && (
            <img src={previewImg ? previewImg : previewPostImg} alt="alert" />
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
            {actionTypes.includes(modalType) && (
              <>
                <h2>{modalDetails}</h2>
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
                    modalType !== "updatePost" && (
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
                </div>
              </>
            )}
            {/* end of the big condition actionTypes */}

            {/* a state is going to be used to count the letters to ensure that it's filled */}
            {/* update post box and button start here */}
            {modalType == "updatePost" && (
              <div className="boxContent">
                <textarea
                  placeholder="Write your updated here..."
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
          {/* BOx CONTENT STARTS HERE (DIV ABOVE)*/}
        </div>
      </div>
    </div>
  );
};

export default ModalBox;
