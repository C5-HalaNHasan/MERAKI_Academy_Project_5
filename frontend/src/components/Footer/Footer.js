import React from "react";
import "./footer.css";
import { AiFillLinkedin } from "react-icons/ai";
const Footer = () => {
  return (
    <div className="footerComponent">
      <div className="leftFooter">
        <h3 >Contact Us</h3>
        <br></br>

        <div className="Linkedin">
          <AiFillLinkedin onClick={()=>{
        
        window.open('https://jo.linkedin.com/in/hala-nazeeh','_blank');

     }} />
          <span> Hala</span>
        </div>
        <div className="Linkedin">
          <AiFillLinkedin onClick={()=>{
        
        window.open('https://jo.linkedin.com/in/ahmad-alkhadraa-a7860b137','_blank');

     }} />
          <span> Ahmad</span>
        </div>

        <div className="Linkedin">
          <AiFillLinkedin />
          <span> Motaz</span>
        </div>
      </div>
      <div className="centerFooter">
        <p>Copyright © 2022 All Rights Reserved By Facebook</p>
      </div>
      <div className="rightFooter">
        <h3>Our Store</h3>
        <br></br>
        <p>
          Facebook is a website which allows users, who sign-up for free
          profiles, to connect with friends, work colleagues or people they
          don't know, online. It allows users to share pictures, music, videos,
          and articles, as well as their own thoughts and opinions with however
          many people they like.
        </p>
      </div>
    </div>
  );
};

export default Footer;
