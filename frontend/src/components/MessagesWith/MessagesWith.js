import React, { useState, useEffect } from "react";
import "./messagesWith.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  setMessagesWith,
  addToMessages,
  removeFromMessages,
} from "../redux/reducers/message/index";

const MessagesWith = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [sentMessage, setSentMessage] = useState("");
  //user states:
  //to use user token for axios calls
  const { token, userId, currentUserInfo } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
      currentUserInfo: state.user.currentUserInfo,
    };
  });
  //message states to be used:
  const { messagesWith } = useSelector((state) => {
    return {
      messagesWith: state.message.messagesWith,
    };
  });

  // a function that sets messagesWith in redux store:
  const getMessagesWith = () => {
    let getMessagesWithUrl = `http://localhost:5000/message/${id}`;
    axios
      .get(getMessagesWithUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setMessagesWith(result.data.result));
        console.log({ all_conversationsWith_result: result.data.result });
      })
      .catch((error) => {
        console.log({ all_conversationsWith_error: error.message });
      });
  };

  // a function that sends message to a user:
  const sendMessageTo = () => {
    let sendMessageToUrl = `http://localhost:5000/message/${id}`;
    axios
      .post(
        sendMessageToUrl,
        { sentMessage },
        { headers: { authorization: token } }
      )
      .then((result) => {
        // dispatch(addToMessages(result.data.result)); //! to be updated in BE to get message id
        getMessagesWith();
        console.log({ sendMessageTo_result: result.data.result });
      })
      .catch((error) => {
        console.log({ sendMessageTo_error: error.message });
      });
  };

  // a function that removes sent message:
  const removeSentMessage = (messageId) => {
    //! message id to be returned from BE
    let removeMessageFromUrl = `http://localhost:5000/message/${messageId}`;
    axios
      .put(removeMessageFromUrl, { headers: { authorization: token } })
      .then((result) => {
        // dispatch(removeFromMessages(result.data.result)); //! to be updated in BE to get message
        getMessagesWith();
        console.log({ removeSentMessage_result: result.data.result });
      })
      .catch((error) => {
        console.log({ removeSentMessage_error: error.message });
      });
  };

  useEffect(() => {
    getMessagesWith();
  }, []);

  console.log(`all messages from user ${id} :`, messagesWith);

  return (
    <div className="messagesWithComponent">
      {messagesWith.length &&
        messagesWith.map((message, ind) => {
          return (
            <>
              <div className="messageCard">
                {/* from others */}
                {message.sentBy != userId && (
                  <div className="messageCard leftSide">
                    <img src={message.profileImg} />
                    <div className="messageContent">
                      <h3>{message.firstName}</h3>
                      <p>{message.message}</p>
                      <h6>
                        {message.createdAt.split(".000Z")[0].replace("T", "@")}
                      </h6>
                    </div>
                  </div>
                )}
                {/* from user */}
                {message.sentBy == userId && (
                  <div className=" messageCard rightSide">
                    <img src={currentUserInfo.profileImg} />
                    <h3>you</h3>
                    <div className="messageContent">
                      <p>{message.message}</p>
                      <h6>
                        {message.createdAt.split(".000Z")[0].replace("T", "@")}
                      </h6>
                    </div>
                    <button onClick={() => removeSentMessage(message.id)}>
                      remove
                    </button>
                  </div>
                )}
              </div>
            </>
          );
        })}
      <div className="messageActions">
        <input
          placeholder="write your message here..."
          onChange={(e) => setSentMessage(e.target.value)}
        />
        <button onClick={() => sendMessageTo()}>send</button>
      </div>
    </div>
  );
};

export default MessagesWith;
