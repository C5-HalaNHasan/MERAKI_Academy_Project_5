import "./login.css";
import axios from "axios";
import React,{useState} from "react";
import { useNavigate,Link } from "react-router-dom";
import {useDispatch} from "react-redux";
import {setLogin,setLogout} from "../redux/reducers/user/index";


const Login = () => {
    //to redirect the user to the home page
    const navigate=useNavigate();
    const dispatch=useDispatch();
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
        dispatch(setLogout);
        console.log(error)//!toast notification to be added
    })
}
    return (
        <div className="registerComponent">
    <div className="loginBox">
    <h3>Login</h3>
    Not a member yet?<span><Link to="/register">Register</Link></span>

    <div className="inputField">
    <label>Email:</label>
    <input type="email" placeholder="email..." name="email" onChange={(e)=>setEmail(e.target.value)} autoComplete="off"></input>
    </div>

    <div className="inputField">
    <label>PassWord:</label>
    <input type="password" placeholder="Password..." name="password" onChange={(e)=>setPassword(e.target.value)} autoComplete="off"></input>
    </div>


    <button onClick={()=>{LoginAction()}} className="btn">Login</button>
</div>
</div>

    );
};

export default Login;