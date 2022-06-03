import "./login.css";
import axios from "axios";
import React,{useState} from "react";
import { useNavigate,Link } from "react-router-dom";
import {useSelector,useDispatch} from "react-redux";
import {setLogin,setLogout} from "../redux/reducers/user/index";


const Login = () => {
    //to redirect the user to the home page
    const navigate=useNavigate();
    const dispatch=useDispatch();

    //to store userId & token in redux store
    const {token,userId}=useSelector((state)=>{
        return{
            token:state.user.token,
            userId:state.user.userId,
        }
    });

   //to store user inputs in inputs fields
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

const LoginAction=()=>{
    const loginUrl="http://localhost:5000/user/login";
    axios.post(loginUrl,{email,password}).then((result)=>{
        //!toast notification to be added
        if(result.data.token){
            dispatch(setLogin({token:result.data.token,userId:result.data.userId}));
            navigate("/home");
        }
    }).catch((error)=>{
        console.log(error)//!toast notification to be added
    })
}
    return (
        <div className="registerComponent">
    <div className="loginBox">
    <h3>Login</h3>
    Not a member yet?<span><Link to="/register">Register</Link></span>
    <input type="email" placeholder="email..." name="email" onChange={(e)=>setEmail(e.target.value)} autoComplete="off"></input>
    <input type="password" placeholder="Password..." name="password" onChange={(e)=>setPassword(e.target.value)} autoComplete="off"></input>
    <button onClick={()=>{LoginAction()}} className="btn">Login</button>
</div>
</div>

    );
};

export default Login;