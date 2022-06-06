import React, { useEffect, useState } from "react";
import "./modalBox.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ok from "../assets/ok.png";
import alert from "../assets/alert.png";
import notOk from "../assets/notOk.jpg";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { setModalBox } from "../redux/reducers/modalBox/index";

//! box is not closing on click
const ModalBox = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //to ensure that the user has entered enough charcters to send a message or report a user:
  const [enteredChar, setEnteredChar] = useState("");
  const [notification, setNotification] = useState("");
  //to use user token for axios calls
  const { token, userId } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
    };
  });
  //to use & set modalBox states:
  const { user, type, message, details, show } = useSelector((state) => {
    return {
      user: state.modalBox.user,
      type: state.modalBox.type,
      message: state.modalBox.message,
      details: state.modalBox.details,
      show: state.modalBox.show,
    };
  });
  console.log("from modalbox", user, type, message, details, show);
  const actionTypes = ["ok", "notOk", "alert"];
  if (show === false) {
    return null;
  }

  const clearModalBox = () => {
    dispatch(
      setModalBox({
        user: "",
        type: "",
        message: "",
        details: "",
        show: false,
      })
    );
  };

  const sendMessage = () => {
    let sendMessageToUserUrl = `http://localhost:5000/message/${user}`;
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
      setNotification("at least 30 characters must be provided!");
    }
  };

  //to be removed from Actions component
  const reportUser = () => {
    let reportUserUrl = `http://localhost:5000/user/remove/${user}`;
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
  return (
    <div className="modalBox">
      <div className="contentsContainer">
        {/* types to be modified later */}
        {type === "ok" && <img src={ok} alt="ok" />}
        {type === "notOk" && <img src={notOk} alt="notOk" />}
        {type === "alert" && <img src={alert} alt="alert" />}

        <div className="modalRight">
          <span class="closeModalBox">
            <AiOutlineCloseCircle
              onClick={() => {
                clearModalBox();
              }}
            />
          </span>

          <div className="boxContent">
            {actionTypes.includes(type) && (
              <>
                <h1>{message}</h1>
                <h2>{details}</h2>
                <div className="actionButtonsContainer">
                  <button
                    className="actionButton"
                    onClick={() => clearModalBox()}
                  >
                    Ok
                  </button>
                </div>
              </>
            )}
            {/* a state is going to be used to count the letters to ensure that it's filled */}
            {type == "sendMessage" && (
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

            {type == "report" && (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBox;
