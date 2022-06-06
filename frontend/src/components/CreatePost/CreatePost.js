import React, { useState } from "react";
import "./createPost.css";
import { useDispatch, useSelector } from "react-redux";
import { addToPosts } from "../redux/reducers/post";
import { HiOutlinePhotograph } from "react-icons/hi";
import { BsFillCameraVideoFill } from "react-icons/bs";
import axios from "axios";
const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const [postVideo, setPostVideo] = useState("");
  const [postImg, setPostImg] = useState("");
  const [clear, setClear] = useState();
  const dispatch = useDispatch();
  const [clickedImg, setClickedImg] = useState(false);
  const [clickedVideo, setClickedVideo] = useState(false);

  const { currentUserInfo, token } = useSelector((state) => {
    return {
      currentUserInfo: state.user.currentUserInfo,
      token: state.user.token,
    };
  });
  const submit = (url) => {
    axios
      .post(
        "http://localhost:5000/post",
        { postText, 
            postVideo:null,
             postImg:url },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((result) => {
        dispatch(addToPosts(postText));
      });
  };
  const uploadImage = () => {
    const data = new FormData();
    
    clickedImg? data.append("file", postImg): data.append("file", postVideo)
    // clickedVideo? data.append("file", postVideo): ""
    
    data.append("upload_preset", "rapulojk");
    data.append("cloud_name", "difjgm3tp");

    let uploadPicUrl = "https://api.cloudinary.com/v1_1/difjgm3tp/image/upload";
    axios
      .post(uploadPicUrl, data)
      .then((result) => {
        // setPostImg(result.data.url);
        console.log(result.data);
        submit(result.data.url)
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <div className="createPostComponent">
      <div className="createPost">
      <div className="topPostCreate">
        <img src={currentUserInfo.profileImg} className="userPostImg" />
        <input
          value={clear}
          onClick={() => {
            setClear();
          }}
          autoComplete="off"
          type={"text"}
          className="userPostInput"
          placeholder={"What is in your mind " + currentUserInfo.firstName}
          onChange={(e) => {
            setPostText(e.target.value);
          }}
        />
      </div>
      <hr/>
      <div className="bottomPostCreate">
        <div className="leftBottomPost">
          <div className="ImgUpload">
            <HiOutlinePhotograph
           
            className="iconImg1"
              onClick={() => {
                setClickedImg(!clickedImg);
              }}
            />
            {clickedImg ? (
              <>
                <input
                  type={"file"}
                  onChange={(e) => {
                    setPostImg(e.target.files[0]);
                  }}
                />

                
              </>
            ) : (
              ""
            )}
          </div>
          <div className="ImgUpload">
            <BsFillCameraVideoFill className="iconImg2"
              onClick={() => {
                setClickedVideo(!clickedVideo);
              }}
            />
            {clickedVideo ? (
              <>
                <input
                  type={"file"}
                  onChange={(e) => {
                    setPostVideo(e.target.files[0]);
                  }}
                />
               
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <button 
        className="postButton"
          onClick={() => {
            // submit();
            setClear("");
            setClickedImg(false);
            setClickedVideo(false);
            uploadImage();

          }}
        >
          Post
        </button>
      </div>
      </div>
    </div>
  );
};

export default CreatePost;
