import React, { useEffect, useState } from "react";
import "./adminDashBoard.css";
import { TiUserDelete } from "react-icons/ti";
import { MdDeleteForever } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { setAllUsers } from "../../redux/reducers/user/index";
import { setAllPosts } from "../../redux/reducers/post/index";

import axios from "axios";

const AdminDashBoard = ({ type }) => {
  const dispatch = useDispatch();
  //to use user token for axios calls
  const { token, userId, allUsers } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
      allUsers: state.user.allUsers,
      posts: state.post.posts,
    };
  });

  //to get allUsers in the dataBase:
  const getAllUsers = () => {
    let allUsersUrl = `http://localhost:5000/user`;
    axios
      .get(allUsersUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setAllUsers(result.data.result));
      })
      .catch((error) => {
        console.log({ fromAdminGetAllUsersError: error });
      });
  };

  //to get reportedUsers:
  const getReportedUsers = () => {
    let reportedUsersUrl = `http://localhost:5000/user/remove`;
    axios
      .get(reportedUsersUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setAllUsers(result.data.result));
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
  const getAllPosts = () => {
    let allPostsUrl = `http://localhost:5000/post`;
    axios
      .get(allPostsUrl, { headers: { authorization: token } })
      .then((result) => {
        dispatch(setAllPosts(result.data.result));
      })
      .catch((error) => {
        console.log({ fromAdminGetReportedPostsError: error });
      });
  };

  //to get reportedPosts: //! authorizatioin needed
  const getReportedPosts = () => {
    let reportedPostsUrl = `http://localhost:5000/post/remove`;
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
    let removeUserUrl = `http://localhost:5000/oost/remove/${id}`;
    axios
      .get(removeUserUrl, { headers: { authorization: token } })
      .then((result) => {
        getAllPosts();
      })
      .catch((error) => {
        console.log({ fromAdminRemoveUserError: error });
      });
  };

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
    } else if (type == "charts") {
      showCharts();
    }
  };

  //!users pagination logic starts here (3 functions to handle the pagination process):
  // users pagination states:
  const [pageNumbers, setPageNumbers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [currentUsers, setCurrentusers] = useState([]);
  //function#1: this function to determine which users to be shown based on pageNumber
  const usersPagination = () => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    setCurrentusers(allUsers.slice(indexOfFirstUser, indexOfLastUser));
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
    getAllPosts();
    usersPagination();
    action();
  }, [currentPage]);
  return (
    <div className="adminDashBoardComponent">
      {/* all usersDiv starts here */}
      <div className="adminResultUsers">
        {type == "allUsers" &&
          currentUsers.length &&
          currentUsers.map((user) => {
            return (
              <div className="adminUserInfo">
                <img src={user.profileImg} />
                <p>{user.firstName + " " + user.lastName}</p>
                <p>{user.birthday.split("T")[0].split("")}</p>
                <p>{user.country.toUpperCase()}</p>
                <TiUserDelete className="icon" onClick={() => removeUser()} />
              </div>
            );
          })}
      </div>
      {/* pagination bar starts here */}
      <div className="paginationBar">
        <ul className="pageNumbers">
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
        </ul>
      </div>
      {/* pagination bar ends here  */}

      {/* allUsers Div ends here */}
    </div>
  );
};

export default AdminDashBoard;
