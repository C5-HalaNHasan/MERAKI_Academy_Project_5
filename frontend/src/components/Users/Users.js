import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import "./users.css";

//Users component will take two props:type(search or friendlist) & name (name of the searched user)
const Users = ({type,name}) => {
        const dispatch = useDispatch();
    const { allUsers, token, userId, } = useSelector((state) => {
      return {
        allUsers: state.user.allUsers,
        token: state.user.token,
        userId: state.token.userId
      };
    });
    if (type === "search") {
      useEffect(() => {
        axios
          .get(`http://localhost:5000/user`)
          .then((result) => {
            console.log(result.data.result);
            dispatch(setAllUsers(result.data.result));
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);
    } else if (type === "friendlist") {
      useEffect(() => {
        axios
          .get(`http://localhost:5000/user/friends/:${userId}`, {
            headers: { authorization: token }
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);
    }
    return (
        <div className="usersComponent">
        usersComponent
        </div>
    );
};

export default Users;