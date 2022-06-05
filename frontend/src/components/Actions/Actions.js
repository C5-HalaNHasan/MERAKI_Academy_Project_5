import React,{useEffect, useState} from 'react';
import "./actions.css";
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';
import {addToFriendsList,removeFromFriendsList,setCurrentUserFriends} from "../redux/reducers/user/index";

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
        }
    });
//a function that reports user by id!
const reportUserById=(id)=>{
    let reportUserUrl=`http://localhost:5000/user/remove/${userId}`
    axios.put(reportUserUrl,{headers:{authorization:token}}).then((result)=>{
        if(result.data.success){
            console.log({fromReportUser_result:result})
            //!toast notification to be added "reported successfully"/a modal box asking for the reason might be added and by clicking ok after filling the box==> the user is going to be reported and the text on the button will change from report t reported!"
        }
    }).catch((error)=>{
        console.log({fromReportUser_error:error}) //! to be deleted and replaced by toast notification
    });
};
//a function that adds a user as a friend if not in currentUserFriends
const addFriend=(id)=>{
    let addFriendUrl=`http://localhost:5000/user/${userId}`
    axios.post(addFriendUrl,{},{headers:{authorization:token}}).then((result)=>{
        if(result.data.success){//!toast notification to be added "added successfully"
            let getUserUrl=`http://localhost:5000/user/${userId}`;
            // console.log({fromAddFriend_result:result})
            axios.get(getUserUrl,{headers:{authorization:token}}).then((result1)=>{
                console.log(result1)
                if(result1.data.success){
                   dispatch(addToFriendsList(result1.data.result));
                   getAllFriends();
                }
            }).catch((error1)=>{
                console.log({fromAddFriend_error1:error1}) //! to be deleted and replaced by toast notification
            })
        }
    }).catch((error)=>{
        console.log({fromAddFriend_error:error}) //! to be deleted and replaced by toast notification
    });
};

//a function that removes a user from currentUserFriends if 
const removeFriend=(id)=>{
    let reportUserUrl=`http://localhost:5000/user/${userId}`
    axios.delete(reportUserUrl,{headers:{authorization:token}}).then((result)=>{
        if(result.data.success){//!toast notification to be added "added successfully"
            let getUserUrl=`http://localhost:5000/user/${userId}`
            // console.log({fromRemoveFriend_result:result})
            axios.get(getUserUrl,{headers:{authorization:token}}).then((result1)=>{
                if(result1.data.success){
                   dispatch(removeFromFriendsList(result1.data.result));
                   getAllFriends();
                }
            }).catch((error1)=>{
                console.log({fromRemoveFriend_error1:error1}) //! to be deleted and replaced by toast notification
            })
        }
    }).catch((error)=>{
        console.log({fromRemoveFriend_error:error}) //! to be deleted and replaced by toast notification
    });
};

//check if friends:
const checkIfFriend=(id)=>{
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
            dispatch(setCurrentUserFriends(result.data.result));
        }
    }).catch((error)=>{
        console.log({fromGetAllFriends_error:error}) //! to be deleted and replaced by toast notification
    })
};
useEffect(()=>{
    checkIfFriend(id);
    // getAllFriends();
},[currentUserFriends]);

console.log(currentUserFriends)
    return (
        <div className="actionsComponent">
        actionsComponent
        <div className="actionButtons">
       {isFriend?
        <button onClick={()=>removeFriend(id)}>Remove</button>:
        <button onClick={(e)=>addFriend(id)}>Add</button>
      }
      {/* send message popup aill appear when clicking on send message button */}
       <button>Send Message</button>
       <button onClick={()=>reportUserById(id)}>Report</button>
        </div>
        </div>
    );
};

export default Actions;