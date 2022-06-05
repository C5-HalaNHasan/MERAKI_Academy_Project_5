import React from 'react';
import "./userInfo.css";

const UserInfo = ({id}) => {
    //! UserInfo component to be modified based on the following:
    //since this component will be shown in profile pages only: id is taken from userProfile Params
    //if id=userId: dispatch(setCurrentUserInfo({getUserById from backend}))
    //if id!=userId: disptch(setVisitedUserInfo({getUserById from backend}))
    return (
        <div className="userInfoComponent">
        userInfoComponent
        </div>
    );
};

export default UserInfo;