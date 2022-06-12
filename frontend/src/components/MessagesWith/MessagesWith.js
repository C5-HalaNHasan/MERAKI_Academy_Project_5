import React, { useState, useEffect } from "react";
import "./messagesWith.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  setMessagesWith,
  addToMessagesWith,
} from "../redux/reducers/message/index";
//for real-time connection:
import { io } from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
const socket = io.connect(ENDPOINT);

const MessagesWith = ({ roomId, id }) => {
  const dispatch = useDispatch();
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
    //! meassagesWith is going to render the messages based on the unique room id
    let getMessagesWithUrl = `http://localhost:5000/message/${id}`;
    axios
      .get(getMessagesWithUrl, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.success) {
          dispatch(setMessagesWith(result.data.result));
          console.log({ all_conversationsWith_result: result.data.result });
        }
      })
      .catch((error) => {
        console.log({ all_conversationsWith_error: error.message });
      });
  };

  // a function that sends message to a user:
  const sendMessageTo = () => {
    console.log(roomId);
    //! sendMessageTo will emit SEND_MESSAGE event with the sentMessage and roomId(message schema and sendMessageToUserById conroller to be updated backend)
    //! the commented code below to be implemented after modifying the message schema(roomId,message) and adding room schema(roomId)
    const messageContent = {
      roomId,
      content: {
        sentBy: userId,
        receivedBy: id,
        message: sentMessage,
      },
    };
    socket.emit("SEND_MESSAGE", messageContent);

    let sendMessageToUrl = `http://localhost:5000/message/${id}`;
    if (sentMessage.length > 0) {
      axios
        .post(
          sendMessageToUrl,
          {
            room: roomId,
            message: sentMessage,
          },
          { headers: { authorization: token } }
        )
        .then((result) => {
          getMessagesWith();
          console.log({ sendMessageTo_result: result.data.result });
          setSentMessage("");
        })
        .catch((error) => {
          console.log({ sendMessageTo_error: error });
        });
    }
  };

  // a function to receiveMessages from the server (by the other user):
  const receiveMessageFrom = () => {
    socket.on("RECEIVE_MESSAGE", (data) => {
      dispatch(addToMessagesWith(data)); //! check if needed
      getMessagesWith();
    });
  };

  // a function that removes sent message:
  const removeSentMessage = (messageId) => {
    let removeMessageFromUrl = `http://localhost:5000/message/${messageId}`;
    axios
      .put(removeMessageFromUrl, {}, { headers: { authorization: token } })
      .then((result) => {
        getMessagesWith();
        console.log({ removeSentMessage_result: result.data.result });
      })
      .catch((error) => {
        console.log({ removeSentMessage_error: error });
      });
  };

  useEffect(() => {
    receiveMessageFrom();
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
                    {/* query in the backend to be updated to get message id */}
                    <button
                      id={message.id}
                      onClick={(e) => removeSentMessage(e.target.id)}
                    >
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
