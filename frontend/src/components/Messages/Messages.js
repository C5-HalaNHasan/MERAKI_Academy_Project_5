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
    let getMessagesUrl = `http://localhost:5000/message/get/user/room`;
    axios
      .get(getMessagesUrl, { headers: { authorization: token } })
      .then((result) => {
        if (!result.data.result.length) {
          // dispatch(
          //   setModalBox({
          //     modalId: "",
          //     modalType: "alert",
          //     modalMessage: "Inbox",
          //     modalDetails: "Your inbox is empty",
          //     modalShow: true,
          //   })
          // );
        } else {
          dispatch(setAllMessages(result.data.result));
          console.log({ all_conversations: result.data.result });
          // dispatch(
          //   setModalBox({
          //     modalId: "",
          //     modalType: "ok",
          //     modalMessage: "Inbox",
          //     modalDetails: `you have ${allMessages.length} conversations!`,
          //     modalShow: true,
          //   })
          // );
        }
      })
      .catch((error) => {});
  };

  console.log({ all_rooms: allMessages });

  useEffect(() => {
    getAllMessages();
  }, []);
  return (
    <div className="messagesComponent">
      {allMessages.length &&
        allMessages.map((room, ind) => {
          return (
            <>
              <div className="messageCard">
                {room.receivedBy == userId ? (
                  <>
                    <img className="leftSide" src={room.profileImg} />
                    <h3 className="leftSide">
                      {room.firstName + " " + room.lastName}
                    </h3>
                    <button
                      className="rightSide"
                      onClick={() => {
                        room.sentBy != userId
                          ? navigate(`/message/${room.roomId}/${room.sentBy}`)
                          : navigate(
                              `/message/${room.roomId}/${room.receivedBy}`
                            );
                      }}
                    >
                      Show
                    </button>
                  </>
                ) : (
                  <>
                    <img className="leftSide" src={room.u2Img} />
                    <h3 className="leftSide">{room.u2f + " " + room.u2l}</h3>
                    <button
                      className="rightSide"
                      onClick={() => {
                        room.sentBy != userId
                          ? navigate(`/message/${room.roomId}/${room.sentBy}`)
                          : navigate(
                              `/message/${room.roomId}/${room.receivedBy}`
                            );
                      }}
                    >
                      Show
                    </button>
                  </>
                )}
              </div>
              {/* to render sent messages */}
            </>
          );
        })}
    </div>
  );
};

export default Messages;
