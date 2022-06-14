import React, { useState, useEffect } from "react";
import "./messagesWith.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  setMessagesWith,
  addToMessagesWith,
  removeFromMessagesWith,
} from "../redux/reducers/message/index";
//for real-time connection:
import { io } from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
const socket = io.connect(ENDPOINT);

const MessagesWith = ({ roomId, id }) => {
  const dispatch = useDispatch();
  const [sentMessage, setSentMessage] = useState("");
  const { token, userId, currentUserInfo } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
      currentUserInfo: state.user.currentUserInfo,
    };
  });
  const { messagesWith } = useSelector((state) => {
    return {
      messagesWith: state.message.messagesWith,
    };
  });

  // a function that sets messagesWith in redux store:
  const getMessagesWith = () => {
    let getMessagesWithUrl = `http://localhost:5000/message/${id}/${roomId}`;
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
  const sendMessageTo = (e) => {
    socket.emit("JOIN_ROOM", roomId);
    console.log(roomId);
    const messageContent = {
      roomId,
      content: {
        room: roomId,
        message: sentMessage,
        sentBy: userId,
        receivedBy: id,
        createdAt: Date.now(),
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
    console.log("message recieved");
    socket.on("RECEIVE_MESSAGE", (data) => {
      dispatch(addToMessagesWith(data));
      getMessagesWith();
    });
  };

  //a function that will be emitted through socket whenever one of the users deletes a message
  const removeMessageFrom = () => {
    socket.on("DELETE_MESSAGE", (data) => {
      dispatch(removeFromMessagesWith(data)); // data is the messageId
      getMessagesWith();
    });
  };

  // a function that removes sent message:
  const removeSentMessage = (messageId) => {
    const messageContent = {
      roomId,
      messageId,
    };
    socket.emit("DELETE_MESSAGE", messageContent);
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

  //to clear the input box:
  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
  };
  useEffect(() => {
    receiveMessageFrom();
    removeMessageFrom();
    getMessagesWith();
  }, []);

  return (
    <div className="messagesWithComponent">
      {messagesWith.length &&
        messagesWith.map((message, ind) => {
          return (
            <>
              <div className="messagesCardContainer">
                {message.sentBy != userId && (
                  <div className="messageCard leftSide">
                    <div className="senderInfo MW">
                      <img src={message.profileImg} />
                      <h3>{message.firstName}</h3>
                    </div>
                    <div className="messageContent">
                      <p>{message.message}</p>
                      <h6>{message.createdAt}</h6>
                    </div>
                    <div className="inboxButtons">
                      <button id={message.id} style={{ opacity: "0" }}>
                        dummy
                      </button>
                    </div>
                  </div>
                )}
                {/* from user */}
                {message.sentBy == userId && (
                  <div className=" messageCard rightSide">
                    <div className="nearby">
                      <div className="senderInfo MW">
                        <img src={currentUserInfo.profileImg} />
                        <h3>you</h3>
                      </div>
                      <div className="messageContent">
                        <p>{message.message}</p>
                        <h6>{message.createdAt}</h6>
                      </div>
                    </div>
                    <div className="inboxButtons">
                      <button
                        id={message.id}
                        onClick={(e) => removeSentMessage(e.target.id)}
                      >
                        remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          );
        })}
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="messageInput">
          <input
            placeholder="write your message here..."
            onChange={(e) => setSentMessage(e.target.value)}
          />
          <div className="inboxButtons sendButton">
            <button type="submit" onClick={() => sendMessageTo()}>
              send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessagesWith;

/*
to be resolved:
1-message.createdAt is not taking split or replace each time//
*/
