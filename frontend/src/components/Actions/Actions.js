import React,{useEffect, useState} from 'react';
import "./actions.css";
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';
import {addToFriendsList,removeFromFriendsList,setCurrentUserFriends,setVisitedUserFriends} from "../redux/reducers/user/index";

const Actions = ({id}) => {
    const [isReported,setIsReported]=useState("Report");
    const [isFriend,setIsFriend]=useState(false);
    //three buttons are going to be rendered with the following actions:
    //currentUser can addFriend(if not in  currentUserFriends) or removeFriend(if in  currentUserFriends)/reportUser/sendMessage
    const dispatch=useDispatch();
    const {token,userId, currentUserFriends}=useSelector((state)=>{
        return{
            token:state.user.token,
            userId:state.user.userId,
            currentUserFriends:state.user.currentUserFriends,
            setVisitedUserFriends:state.user.setVisitedUserFriends
        }
    });

//a function that reports a user by id!
const reportUserById=()=>{
    let reportUserUrl=`http://localhost:5000/user/remove/${id}`
    axios.put(reportUserUrl,{},{headers:{authorization:token}}).then((result)=>{
        if(result.data.success){
            console.log({fromReportUser_result:result})
            setIsReported("Reported");
            //!toast notification to be added "reported successfully"/a modal box asking for the reason might be added and by clicking ok after filling the box==> the user is going to be reported and the text on the button will change from report t reported!"
        }
    }).catch((error)=>{
        console.log({fromReportUser_error:error}) //! to be deleted and replaced by toast notification
    });
};
//a function that adds a user as a friend if not in currentUserFriends
const addFriend=()=>{
    let addFriendUrl=`http://localhost:5000/user/${id}`
    axios.post(addFriendUrl,{},{headers:{authorization:token}}).then((result)=>{
        if(result.data.success){//!toast notification to be added "added successfully"
            dispatch(addToFriendsList(result.data.result[0]));
        }
    }).catch((error)=>{
        console.log({fromAddFriend_error:error}) //! to be deleted and replaced by toast notification
    });
};

//a function that removes a user from currentUserFriends if 
const removeFriend=()=>{
    let removeUserUrl=`http://localhost:5000/user/${id}`
    axios.delete(removeUserUrl,{headers:{authorization:token}}).then((result)=>{
        if(result.data.success){//!toast notification to be added "added successfully"
            dispatch(removeFromFriendsList(result.data.result[0].id));
        }
    }).catch((error)=>{
        console.log({fromRemoveFriend_error:error}) //! to be deleted and replaced by toast notification
    });
};

//check if friends:
const checkIfFriend=()=>{
let checked= currentUserFriends.filter((friend)=>{
        return friend.id==id;
    })
    return checked.length?setIsFriend(true):setIsFriend(false);
};

//to re-get current userFriends:
const getAllFriends=async()=>{
    let getFriendsUrl=` http://localhost:5000/user/friends/${id}`;//! supposed to show friend on the visited page not mine
    axios.get(getFriendsUrl,{headers:{authorization:token}}).then((result)=>{
        if(result.data.success){
            dispatch(setVisitedUserFriends(result.data.result));
        }
    }).catch((error)=>{
        console.log({fromGetAllFriends_error:error}) //! to be deleted and replaced by toast notification
    })
};
useEffect(()=>{
    checkIfFriend();
    // getAllFriends();
},[isFriend]);

console.log(currentUserFriends)
    return (
        <div className="actionsComponent">
        actionsComponent
        <div className="actionButtons">
       {isFriend?
        <button onClick={()=>removeFriend()}>Remove</button>:
        <button onClick={()=>addFriend()}>Add</button>
      }
      {/* send message popup aill appear when clicking on send message button */}
       <button>Send Message</button>
       {/* function to be added later in the backend to remove report from user */}
       <button onClick={()=>reportUserById(id)}>{isReported}</button>
        </div>
        </div>
    );
};

export default Actions;