import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:{
        token: localStorage.getItem("token") || "",
        userId: localStorage.getItem("userId") || "",
        currentUserInfo:{},
        visitedUserInfo:{},
        currentUserFriends:[],
        visitedUserFriends:[],
        allUsers:[],
    },
    reducers:{
        setLogin:(state,action)=>{
            // action:{payload:{token,userId}}
            state.token=action.payload.token;
            state.userId=action.payload.userId;
            localStorage.setItem("token",`Bearer ${action.payload.token}`); 
            localStorage.setItem("userId",`${action.payload.userId}`); 
        },
        setLogout:(state,action)=>{
            state.token="";
            state.userId="";
            localStorage.clear();
        },
        setCurrentUserInfo:(state,action)=>{
            // action:{payload:{userInfo}}
            state.currentUserInfo=action.payload;
        },
        setVisitedUserInfo:(state,action)=>{
            // action:{payload:{userInfo}}
            state.visitedUserInfo=action.payload;
        },
        setCurrentUserFriends:(state,action)=>{
            // action:{payload:[]}
            state.currentUserFriends=action.payload;
        },
        setVisitedUserFriends:(state,action)=>{
            // action:{payload:[]}
            state.visitedUserFriends=action.payload;
        },
        setAllUsers:(state,action)=>{
            // action:{payload:[]}
            state.allUsers=action.payload;
        },
        addToFriendsList:(state,action)=>{
            // action:{payload:{}}
            state.userFriends.push(action.payload);
        },
        removeFromFriendsList:(state,action)=>{
            // action:{payload:id of removed user from friendlist}
            state.userFriends.splice(action.payload,1)
        },
        updateUserInfo:(state,action)=>{
            // action:{payload:{updated info}}
            state.allUsers = state.allUsers.map((user, index) => {
                if (user.id == action.payload.id) {
                  return {
                    ...user,
                    firstName:action.payload.firstName||user.firstName,
                    lastName:action.payload.lastName||user.lastName,
                    password:action.payload.password||user.password,
                    birthday:action.payload.birthday||user.birthday,
                    country:action.payload.country||user.country,
                    profileImg:action.payload.profileImg||user.profileImg,
                    coverImg:action.payload.coverImg||user.coverImg,
                    isPrivate:action.payload.isPrivate||user.isPrivate,
                  };
                }
                return user;
              });
        },
    }
});

export const {setLogin,setLogout,setCurrentUserInfo,setVisitedUserInfo, setCurrentUserFriends,setVisitedUserFriends,setAllUsers,addToFriendsList,removeFromFriendsList,updateUserInfo}=userSlice.actions;
export default userSlice.reducer;