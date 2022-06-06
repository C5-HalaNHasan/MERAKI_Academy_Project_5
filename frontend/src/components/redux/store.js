import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./reducers/user/index";
import postReducer from "./reducers/post/index";
import messageReducer from "./reducers/message/index";
import modalBoxReducer from "./reducers/modalBox/index"


export default configureStore({
    reducer:{
        user:userReducer,
        post:postReducer,
        message:messageReducer,
        modalBox:modalBoxReducer
    }
});