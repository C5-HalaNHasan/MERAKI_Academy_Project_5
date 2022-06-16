import React from "react";
import bannerImg from "../assets/banner.png";

const Banner = () => {
  return (
    <div className="profileImgsComponent">
      <div className="imgContainer">
        <div className="coverImg">
          <img src={bannerImg} />
        </div>
      </div>
    </div>
  );
};

export default Banner;
