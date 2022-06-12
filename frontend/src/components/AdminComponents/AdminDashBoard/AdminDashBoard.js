import React, { useEffect, useState } from "react";
import "./adminDashBoard.css";
import { TiUserDelete } from "react-icons/ti";
import { AiFillDelete } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
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
  const { token, userId, allUsers, allReportedUsers, posts, comments } =
    useSelector((state) => {
      return {
        token: state.user.token,
        userId: state.user.userId,
        allUsers: state.user.allUsers,
        posts: state.post.posts,
        comments: state.post.comments,

        allReportedUsers: state.user.allReportedUsers,
      };
    });

  //to get allUsers in the dataBase:

  const getAllUsers = () => {
    let allUsersUrl = `http://localhost:5000/user/pag?page=1&limit=4`;
    axios
      .get(allUsersUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setAllUsers(result.data.result));

        console.log(arrLength);
      })
      .catch((error) => {
        console.log({ fromAdminGetAllUsersError: error });
      });
  };
  const [page, setPage] = useState(1);
  const [arrLength, setArrLength] = useState(0);
  const [show, setShow] = useState(false);
  const getAllUsersNext = (page) => {
    let allUsersUrl = `http://localhost:5000/user/pag?page=${page}&limit=4`;
    axios
      .get(allUsersUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setAllUsers(result.data.result));
        setArrLength(result.data.result.length);
      })
      .catch((error) => {
        console.log({ fromAdminGetAllUsersError: error });
      });
  };

  //to get reportedUsers:
  const getReportedUsers = () => {
    let reportedUsersUrl = `http://localhost:5000/user/remove/?page=1&limit=4`;
    axios
      .get(reportedUsersUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setAllReportedUsers(result.data.result));
        setArrLength(result.data.result.length);
      })
      .catch((error) => {
        console.log({ fromAdminGetReportedUsersError: error });
      });
  };

  const getReportedUsersNext = (page) => {
    let reportedUsersUrl = `http://localhost:5000/user/remove/?page=${page}&limit=4`;
    axios
      .get(reportedUsersUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setAllReportedUsers(result.data.result));
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
    let reportedPostsUrl = `http://localhost:5000/post/remove?page=1&limit=4`;
    axios
      .get(reportedPostsUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setAllPosts(result.data.result));
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
      .get(`http://localhost:5000/comment/remove/?page=1&limit=4`, {
        headers: { authorization: token },
      })
      .then((result) => {
        dispatch(setAllComments(result.data.result));
      })
      .catch((error) => {});
  };
  const getAllReportedCommentsNext = (page) => {
    axios
      .get(`http://localhost:5000/comment/remove/?page=${page}&limit=4`, {
        headers: { authorization: token },
      })
      .then((result) => {
        dispatch(setAllComments(result.data.result));
      })
      .catch((error) => {});
  };
const removeComment = (id)=>{
  axios.delete(`http://localhost:5000/comment/remove/${id}`,{ headers: { authorization: token },}) .then((result) => {
    dispatch(removeFromComments(id));
  })
  .catch((error) => {});
}
  //to vie charts and statistics:
  const showCharts = () => {};
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

  useEffect(() => {
    getAllUsers();
    getReportedUsers();
    getReportedPosts();
    getAllReportedComments();
    usersPagination();
    action();
  }, []);
  return (<>
    

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
                  onClick={() => {
                    setShow(!show);
                  }}
                >
                  Show Post
                </button>
                {/* modalbox */}
                {show ? (
                  <>
                    {" "}
                    <p>{post.postText}</p>
                    <img src={post.postImg} />
                  </>
                ) : (
                  ""
                )}

                <div>
                  <AiFillDelete
                    className="icon"
                    id={post.id}
                    onClick={(e) => {
                      console.log(e.target);
                      removeComment(e.target.id);
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
                <p>{comment.comment}</p>

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
      </div>
      {/* pagination bar starts here */}
      <div className="paginationBar">
        {page == 1 ? (
          ""
        ) : (
          <button
          className="prevBtn"
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
        <button
        className="nextBtn"
          onClick={() => {
            getAllUsersNext(page + 1);
            getReportedUsersNext(page + 1);
            getReportedPostsNext(page + 1);
            getAllReportedCommentsNext(page + 1);
            setPage(page + 1);
          }}
        >
          Next
        </button>
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
