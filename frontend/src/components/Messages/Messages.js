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
  const { user, type, message, details, show } = useSelector((state) => {
    return {
      user: state.modalBox.user,
      type: state.modalBox.type,
      message: state.modalBox.message,
      details: state.modalBox.details,
      show: state.modalBox.show,
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
              user: "",
              type: "alert",
              message: "you don't have any conversation!",
              details: "",
              show: true,
            })
          );
        } else {
          let x = filteredMessages();
          dispatch(
            //modalBox pops-up:
            setModalBox({
              user: "",
              type: "ok",
              message: `you have ${x.length} conversations!`, //!
              details: "",
              show: true,
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
                      ? navigate(`/message/${message.sentBy}`)
                      : navigate(`/message/${message.receivedBy}`);
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
