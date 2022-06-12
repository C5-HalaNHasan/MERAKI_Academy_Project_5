import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./messages.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setAllMessages } from "../redux/reducers/message/index";
import { setModalBox } from "../redux/reducers/modalBox/index";

const Messages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  //user states:
  //to use user token for axios calls
  const { token, userId } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
    };
  });
  //message states to be used:
  const { allMessages } = useSelector((state) => {
    return {
      allMessages: state.message.allMessages,
    };
  });

  //modalBox states:
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
  // a function that sets allMessages in redux store:
  const getAllMessages = () => {
    let getMessagesUrl = `http://localhost:5000/message`;
    axios
      .get(getMessagesUrl, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.result.length == 0) {
          //modalBox pops-up:
          dispatch(
            setModalBox({
              modalId: "",
              modalType: "alert",
              modalMessage: "Inbox",
              modalDetails: "Your inbox is empty",
              modalShow: true,
            })
          );
        } else {
          let x = filteredMessages();
          dispatch(
            //modalBox pops-up:
            setModalBox({
              modalId: "",
              modalType: "ok",
              modalMessage: "Inbox", //!
              modalDetails: `you have ${x.length} conversations!`,
              modalShow: true,
            })
          );
          dispatch(setAllMessages(result.data.result));
          console.log({ all_conversations: result.data.result });
        }
      })
      .catch((error) => {});
  };
  const filteredMessages = () => {
    //! duplicates to be removed
    let filtered = allMessages.filter((conv, ind) => {
      return conv.sentBy != userId || conv.receivedBy != userId;
    });
    setList(filtered);
    return filtered;
  };

  console.log({ filtered_messages_to_be_rendered: list });

  useEffect(() => {
    getAllMessages();
    filteredMessages();
  }, []);
  return (
    <div className="messagesComponent">
      {allMessages.length &&
        list.map((message, ind) => {
          return (
            <>
              <div className="messageCard">
                <img className="leftSide" src={message.profileImg} />
                <h3 className="leftSide">
                  {message.firstName + " " + message.lastName}
                </h3>
                <button
                  className="rightSide"
                  onClick={() => {
                    message.sentBy != userId
                      ? navigate(`/message/${message.sentBy}`) //! to be replaced by room id
                      : navigate(`/message/${message.receivedBy}`); //! to be replaced by room id
                  }}
                >
                  Show
                </button>
              </div>
              {/* to render sent messages */}
            </>
          );
        })}
    </div>
  );
};

export default Messages;
