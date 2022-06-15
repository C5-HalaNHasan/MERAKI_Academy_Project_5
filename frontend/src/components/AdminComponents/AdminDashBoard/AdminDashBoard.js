import React, { useEffect, useState } from "react";
import "./adminDashBoard.css";
import { TiUserDelete } from "react-icons/ti";
import { AiFillDelete } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { setModalBox } from "../../redux/reducers/modalBox/index";
import ReactDOM from 'react-dom';
import * as V from 'victory';
import { VictoryBar ,VictoryChart,VictoryTheme,VictoryAxis,VictoryPie,VictoryLabel} from 'victory';
import {
  setAllUsers,
  setAllReportedUsers,
} from "../../redux/reducers/user/index";
import {
  setAllPosts,
  removeFromPosts,
  setAllComments,
  removeFromComments,
} from "../../redux/reducers/post/index";

import axios from "axios";

const AdminDashBoard = ({ type }) => {
  const dispatch = useDispatch();
  //to use user token for axios calls
  const {
    token,
    userId,
    allUsers,
    allReportedUsers,
    posts,
    comments,
  } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
      allUsers: state.user.allUsers,
      posts: state.post.posts,
      comments: state.post.comments,

      allReportedUsers: state.user.allReportedUsers,
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

  //to get allUsers in the dataBase:
  const [usersLength, setUsersLength] = useState(0);
  const [reportedUsersLength, setReportedUsersLength] = useState(0);
  const [postLength, setPostLength] = useState(0);
  const [commentLength, setCommentLength] = useState(0);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);

  // const data = [
  //   {quarter: 1, earnings: 13000},
  //   {quarter: 2, earnings: 16500},
  //   {quarter: 3, earnings: 14250},
  //   {quarter: 4, earnings: 19000}
  // ];

  const getAllUsers = () => {
    let allUsersUrl = `http://localhost:5000/user/pag?page=1&limit=6`;
    axios
      .get(allUsersUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setAllUsers(result.data.result));
        setPage(1);

        setUsersLength(result.data.users_count);
      })
      .catch((error) => {
        console.log({ fromAdminGetAllUsersError: error });
      });
  };
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const getAllUsersNext = (page) => {
    let allUsersUrl = `http://localhost:5000/user/pag?page=${page}&limit=6`;
    axios
      .get(allUsersUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setAllUsers(result.data.result));
        setUsersLength(result.data.result.length);
      })
      .catch((error) => {
        console.log({ fromAdminGetAllUsersError: error });
      });
  };

  //to get reportedUsers:
  const getReportedUsers = () => {
    let reportedUsersUrl = `http://localhost:5000/user/remove/?page=1&limit=6`;
    axios
      .get(reportedUsersUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setAllReportedUsers(result.data.result));
        setPage(1);

        setReportedUsersLength(result.data.users_count);
        console.log(result.data);
      })
      .catch((error) => {
        console.log({ fromAdminGetReportedUsersError: error });
      });
  };

  const getReportedUsersNext = (page) => {
    let reportedUsersUrl = `http://localhost:5000/user/remove/?page=${page}&limit=6`;
    axios
      .get(reportedUsersUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setAllReportedUsers(result.data.result));
        setReportedUsersLength(result.data.result.length);
      })
      .catch((error) => {
        console.log({ fromAdminGetReportedUsersError: error });
      });
  };
  //to remove a user from dataBase:
  const removeUser = (id) => {
    let removeUserUrl = `http://localhost:5000/user/remove/${id}`;
    axios
      .delete(removeUserUrl, { headers: { authorization: token } })
      .then((result) => {
        getAllUsers();
      })
      .catch((error) => {
        console.log({ fromAdminRemoveUserError: error });
      });
  };

  //to get AllPosts:
  // const getAllPosts = () => {
  //   let allPostsUrl = `http://localhost:5000/post`;
  //   axios
  //     .get(allPostsUrl, { headers: { authorization: token } })
  //     .then((result) => {
  //       dispatch(setAllPosts(result.data.result));
  //     })
  //     .catch((error) => {
  //       console.log({ fromAdminGetReportedPostsError: error });
  //     });
  // };

  //to get reportedPosts: //! authorizatioin needed
  const getReportedPosts = () => {
    let reportedPostsUrl = `http://localhost:5000/post/remove?page=1&limit=6`;
    axios
      .get(reportedPostsUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setAllPosts(result.data.result));
        setPage(1);

        setPostLength(result.data.users_count);
        // setArrLength(result.data.result.length);
      })
      .catch((error) => {
        console.log({ fromAdminGetReportedPostsError: error });
      });
  };

  const getReportedPostsNext = (page) => {
    let reportedPostsUrl = `http://localhost:5000/post/remove?page=${page}&limit=4`;
    axios
      .get(reportedPostsUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setAllPosts(result.data.result));
        setPostLength(result.data.result.length);
        // setArrLength(result.data.result.length);
      })
      .catch((error) => {
        console.log({ fromAdminGetReportedPostsError: error });
      });
  };

  //to remove a post from dataBase:
  const removePost = (id) => {
    console.log(id);
    let removeUserUrl = `http://localhost:5000/post/remove/${id}`;
    axios
      .delete(removeUserUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(removeFromPosts(id));
      })
      .catch((error) => {
        console.log({ fromAdminRemoveUserError: error });
      });
  };
  // get all reported comments
  const getAllReportedComments = () => {
    axios
      .get(`http://localhost:5000/comment/remove/?page=1&limit=6`, {
        headers: { authorization: token },
      })
      .then((result) => {
        dispatch(setAllComments(result.data.result));
        setPage(1);

        setCommentLength(result.data.users_count);
      })
      .catch((error) => {});
  };
  const getAllReportedCommentsNext = (page) => {
    axios
      .get(`http://localhost:5000/comment/remove/?page=${page}&limit=6`, {
        headers: { authorization: token },
      })
      .then((result) => {
        dispatch(setAllComments(result.data.result));
        setCommentLength(result.data.result.length);
      })
      .catch((error) => {});
  };
  const removeComment = (id) => {
    axios
      .delete(`http://localhost:5000/comment/remove/${id}`, {
        headers: { authorization: token },
      })
      .then((result) => {
        dispatch(removeFromComments(id));
      })
      .catch((error) => {});
  };
  //to vie charts and statistics:
  const showCharts = () => {
    axios
      .get(`http://localhost:5000/user/birthday`)
      .then((result) => {
        setData(result.data.result)
        console.log(result, "char");
      })
      .catch((error) => {});
      axios
      .get(`http://localhost:5000/user/gender`)
      .then((result) => {
        setData2(result.data.result)
        console.log(result.data.result);
        
      })
      .catch((error) => {
        console.log(error);
      });

  };
  //! based on the props: the targeted action is going to be called:
  const action = () => {
    if (type == "allUsers") {
      getAllUsers();
    } else if (type == "reportedUsers") {
      getReportedUsers();
    } else if (type == "reportedPosts") {
      getReportedPosts();
    } else if (type == "reportedPComments") {
      getAllReportedComments();
    } else if (type == "charts") {
      showCharts();
    }
  };

  //!users pagination logic starts here (3 functions to handle the pagination process):
  // users pagination states:
  const [pageNumbers, setPageNumbers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(3);
  const [currentUsers, setCurrentUsers] = useState([]);
  //function#1: this function to determine which users to be shown based on pageNumber
  const usersPagination = () => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    setCurrentUsers(allUsers.slice(indexOfFirstUser, indexOfLastUser));
    pagination(allUsers.length, usersPerPage);
  };

  //function#2: this function to determine the number of pages required:
  const pagination = (total, perPage) => {
    for (let i = 1; i < Math.ceil(total / perPage); i++) {
      setPageNumbers((old) => [...old, i]);
    }
  };

  //function#3: this function allows the admin to move between pages:
  const changePage = (number) => {
    setCurrentPage(number);
  };
  //!users pagination logic ends here

  //! dispatching showReportedPost:
  const showReportedPost = (reportedPostId) => {
    dispatch(
      setModalBox({
        modalId: reportedPostId,
        modalType: "showPost",
        modalMessage: "Reported Post",
        modalDetails: "",
        modalShow: true,
      })
    );
  };
  const showReportedComment =(reportedCommentId)=>{
    dispatch(
      setModalBox({
        modalId: reportedCommentId,
        modalType: "showComment",
        modalMessage: "Reported Comment",
        modalDetails: "",
        modalShow: true,
      })
    );
  }
  const sharedAxisStyles = {
   
    tickLabels: {
      fill: "#898F9C",
      fontSize: 14
    },
    axisLabel: {
      fill: "#898F9C",
      padding: 36,
      fontSize: 15,
      
    }
  };
  useEffect(() => {
    showCharts();
    getAllUsers();
    getReportedUsers();
    getReportedPosts();
    getAllReportedComments();
    usersPagination();
    action();
  }, []);
  return (
    <>
      <div className="adminDashBoardComponent">
        {/* all usersDiv starts here */}

        <div className="adminResultUsers">
          {type == "allUsers" &&
            allUsers.length &&
            allUsers.map((user) => {
              return (
                <div className="adminUserInfo">
                  <img src={user.profileImg} />
                  <p>{user.firstName + " " + user.lastName}</p>
                  <p>{user.birthday.split("T")[0].split("")}</p>
                  <p>{user.country.toUpperCase()}</p>
                  <div>
                    <TiUserDelete
                      className="icon"
                      id={user.id}
                      onClick={(e) => removeUser(e.target.id)}
                    />
                  </div>
                </div>
              );
            })}
          {type == "reportedUsers" &&
            allReportedUsers.length &&
            allReportedUsers.map((user) => {
              return (
                <div className="adminUserInfo">
                  <img src={user.profileImg} />
                  <p>{user.firstName + " " + user.lastName}</p>
                  <p>{user.birthday.split("T")[0].split("")}</p>
                  <p>{user.country.toUpperCase()}</p>
                  <div>
                    <TiUserDelete
                      className="icon"
                      id={user.id}
                      onClick={(e) => removeUser(e.target.id)}
                    />
                  </div>
                </div>
              );
            })}
          {type == "reportedPosts" &&
            posts.length &&
            posts.map((post) => {
              return (
                <div className="adminUserInfo">
                  <img src={post.profileImg} />
                  <p>{post.firstName + " " + post.lastName}</p>
                  <p>{post.createdAt.split("T")[0].split("")}</p>
                  <button
                    className="nextBtn"
                    id={post.id}
                    onClick={(e) => {
                      // setShow(!show);
                      showReportedPost(e.target.id);
                    }}
                  >
                    Show Post
                  </button>
                  {/* modalbox */}
               

                  <div>
                    <AiFillDelete
                      className="icon"
                      id={post.id}
                      onClick={(e) => {
                        console.log(e.target);
                        removePost(e.target.id);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          {type == "reportedComments" &&
            comments.length &&
            comments.map((comment) => {
              return (
                <div className="adminUserInfo">
                  <img src={comment.profileImg} />
                  <p>{comment.firstName + " " + comment.lastName}</p>
                  <p>{comment.createdAt.split("T")[0].split("")}</p>
                  <button
                    className="nextBtn"
                    id={comment.id}
                    onClick={(e) => {
                      // setShow(!show);
                      showReportedComment(e.target.id);
                    }}
                  >
                    Show Post
                  </button>
                  {/* <p>{comment.comment}</p> */}

                  <div>
                    <AiFillDelete
                      className="icon"
                      id={comment.id}
                      onClick={(e) => {
                        console.log(e.target);
                        removeComment(e.target.id);
                      }}
                    />
                  </div>
                </div>
              );
            })}
            { type=="charts" && data.length !=0 && data2.length !=0 ?<>
            <div className="Gender">
             <VictoryChart
            
             theme={VictoryTheme.material}
             height={210} width={900}
            
             domainPadding={{ x: 200, y: [0, 20] }}

             >
                <VictoryAxis
          // tickValues specifies both the number of ticks and where
          // they are placed on the axis
          tickValues={[1, 2]}
          tickFormat={["Male", "Female"]}
          style={{
            ...sharedAxisStyles
          }}
          label="Gender"
        />
        <VictoryAxis
          dependentAxis
          style={{
            ...sharedAxisStyles
          }}
          
         label="# Of users"
          />
            <VictoryBar
           
        data={data2}
        // data accessor for x values
        x="gender"
        // data accessor for y values
        y="Total"
        style={{
          data: { fill: "#4267B2" },
          
        }}
      />
      </VictoryChart></div>
<div className="Gender">
      <VictoryChart
            
             theme={VictoryTheme.material}
             height={200} width={900}
            
             domainPadding={{ x: 100, y: [0, 65] }}

             >
                <VictoryAxis
          
          style={{
            ...sharedAxisStyles
          }}
          
         label="Year Of Birth"
          />
           <VictoryAxis
          dependentAxis
          style={{
            ...sharedAxisStyles
          }}
          
         label="# Of users"
          />
            <VictoryBar
           
        data={data}
        // data accessor for x values
        x="YEAR(birthday)"
        // data accessor for y values
        y="COUNT(*)"
        style={{
          data: { fill: "#4267B2" }
        }}
      />
      </VictoryChart></div>
      </>
      :""}
        </div>
        {/* pagination bar starts here */}
        <div className="paginationBar">
          {page == 1 ? (
            ""
          ) : (
            <button
              className="nextBtn"
              onClick={() => {
                getAllUsersNext(page - 1);
                getReportedUsersNext(page - 1);
                getReportedPostsNext(page - 1);
                getAllReportedCommentsNext(page - 1);
                setPage(page - 1);
              }}
            >
              Back
            </button>
          )}
          {type == "allUsers" && usersLength >= 6 && (
            <button
              className="nextBtn"
              onClick={() => {
                getAllUsersNext(page + 1);
                setPage(page + 1);
              }}
            >
              Next
            </button>
          )}
          {type == "reportedUsers" && reportedUsersLength >= 6 && (
            <button
              className="nextBtn"
              onClick={() => {
                getReportedUsersNext(page + 1);
                setPage(page + 1);
              }}
            >
              Next
            </button>
          )}
          {type == "reportedPosts" && postLength >= 6 && (
            <button
              className="nextBtn"
              onClick={() => {
                getReportedPostsNext(page + 1);

                setPage(page + 1);
              }}
            >
              Next
            </button>
          )}
          {type == "reportedComments" && commentLength >= 6 && (
            <button
              className="nextBtn"
              onClick={() => {
                getAllReportedCommentsNext(page + 1);
                setPage(page + 1);
              }}
            >
              Next
            </button>
          )}

          {/* <ul className="pageNumbers">
          {pageNumbers.map((number) => {
            return (
              <li
                onClick={() => {
                  changePage(number);
                }}
              >
                {number}
              </li>
            );
          })}
        </ul> */}
        </div>
        {/* pagination bar ends here  */}

        {/* allUsers Div ends here */}
        {/* <button onClick={()=>{
        getAllUsersNext(page-1)
        setLimit(5)
        setPage(page-1)

      }} >Back</button>
      <button onClick={()=>{
        getAllUsersNext(page+1)
        setPage(page+1)
        setLimit(5)

      }} >Next</button> */}
      </div>
    </>
  );
};

export default AdminDashBoard;
