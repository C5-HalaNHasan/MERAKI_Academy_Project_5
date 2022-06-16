import axios from "axios";
import React, { useEffect, useState } from "react";
import "./adv.css";

const Adv = () => {
  const [imgNews, setImgNews] = useState("");
  let [index, setIndex] = useState(0);

  //   useEffect(()=>{
  //     setInterval(() => {
  //             if (index == 19) {
  //             setIndex(0);
  //             } else {
  //               setIndex(index++);
  //               console.log(index);
  //             }
  //           }, 5000);
  //   },[])

  const adv = () => {
    axios
      .get(
        "https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=c6fc5ff0868641f19393cabe5ca30802"
      )
      .then((result) => {
        setImgNews(result.data.articles[index].urlToImage);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    adv();
  }, [index]);

  return (
    <div className="advComponent">
      <div className="friendList advList">
        <div className="boxTitle">
          <h3>Advertisement</h3>
        </div>
        <div className="advImg">
          <img src={imgNews} />
        </div>
      </div>
    </div>
  );
};

export default Adv;
