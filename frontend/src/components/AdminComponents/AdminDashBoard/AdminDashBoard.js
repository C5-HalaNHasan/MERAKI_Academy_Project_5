import React, { useEffect } from "react";
import "./adminDashBoard.css";
import { TiUserDelete } from "react-icons/ti";
import { MdDeleteForever } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { setAllUsers } from "../../redux/reducers/user/index";
import { setAllPosts } from "../../redux/reducers/post/index";

import axios from "axios";

const AdminDashBoard = ({ type }) => {
  //to use user token for axios calls
  const dispatch = useDispatch();
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

  //to remove user from dataBase:
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

  //to remove pots from dataBase:
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
  console.log(allUsers);
  useEffect(() => {
    action();
  }, []);
  return (
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
                <TiUserDelete className="icon" onClick={() => removeUser()} />
              </div>
            );
          })}
      </div>
      {/* all usersDiv starts here above */}
    </div>
  );
};

export default AdminDashBoard;
