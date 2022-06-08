import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./updateProfile.css";

const UpdateProfile = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [hashedPassword, setHashedPassword] = useState("");
    const [birthday, setBirthday] = useState("");
    const [country, setCountry] = useState("");
    const [profileImg, setProfileImg] = useState("");
    const [coverImg, setCoverImg] = useState("");
    const [isPrivate, setIsPrivate] = useState(0);
    const dispatch = useDispatch();
    const { currentUserInfo } = useSelector((state) => {
      return { currentUserInfo: state.user.currentUserInfo };
    })
  return <div className="updateProfileComponent">updateProfileComponent</div>;
};

export default UpdateProfile;
