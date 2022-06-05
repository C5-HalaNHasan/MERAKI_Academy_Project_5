import React,{useState} from "react";
import "./register.css";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import {useDispatch} from "react-redux";
import {setLogin,setLogout} from "../redux/reducers/user/index";

const Register = () => {
    //to redirect the user to the home page afetr a successful registration
    const navigate=useNavigate();
    const dispatch=useDispatch();
    //to save user input:
    const [firstName,setFirstName]=useState("")
    const [lastName,setLastName]=useState("")
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [country,setCountry]=useState("");
    const [gender,setGender]=useState("0");
    const [birthday,setBirthday]=useState("");
    const [role_id,setRole_id]=useState(1)

    const RegisterAction=async ()=>{ 
        //when the user clicks on the register button: the userData is going to be sent to the BE by axios!
        let userData={firstName,lastName,email,password,country,gender,birthday,role_id}
        let registerUrl="http://localhost:5000/user";
        await axios.post(registerUrl,userData).then(async (result)=>{

            // will make the login automatically so that the user can navigate the site once registered(by using the login component here
            if(result.data.success == true){
    //an automatic login in is going to be made and the user will be redirected to the main page (once created)
        await axios.post("http://localhost:5000/user/login",{
            email:userData.email,
            password:userData.password,
        }).then(async (result1)=>{
            
            console.log({fromregister:result1})
            dispatch(setLogin({token:result1.data.token,userId:result1.data.userId}));
            navigate("/home");
                }).catch((error1)=>{
                    dispatch(setLogout);
                    console.log(error1);//!toast notification to be added
                })
            }
            //!toast notification to be added here 
            }).catch((error)=>{
            dispatch(setLogout);
            console.log(error);//!toast notification to be added
        });
    }

    return (
        <div className="registerComponent">
    <div className="loginBox">
    <h3>Register</h3>
    already a member?<span><Link to="/login">Login</Link></span>
    <div className="inputField">
    <label>First Name:</label>
    <input type="text" placeholder="First Name..." name="firstName" onChange={(e)=>setFirstName(e.target.value)}  autoComplete="off"></input>
    </div>

    <div className="inputField">
    <label>Last Name:</label>
    <input type="text" placeholder="Last Name..." name="lastName" onChange={(e)=>setLastName(e.target.value)} autoComplete="off"></input>
    </div>

    <div className="inputField">
     <div className="dropDown">
        <label >Gender:</label>
        <select name="gender" onChange={(e)=>setGender(e.target.value)}>
        <option value="0">Male</option>
        <option value="1">Female</option>
        </select>
    </div>
    </div>

    <div className="inputField">
    <label>Birthday:</label>
       <input type="date"  placeholder="Birthday..." name="birthday" onChange={(e)=>setBirthday(e.target.value)} autoComplete="off"></input>
    </div>

    <div className="inputField">
    <label >Country:</label>
    <input type="text" placeholder="Country..." name="country" onChange={(e)=>setCountry(e.target.value)} autoComplete="off"></input>
    </div>

    <div className="inputField">
    <label>Email:</label>
    <input type="email" placeholder="email..." name="email" onChange={(e)=>setEmail(e.target.value)} autoComplete="off"></input>
    </div>
    <div className="inputField">
    <label>PassWord:</label>
    <input type="password" placeholder="Password..." name="password" onChange={(e)=>setPassword(e.target.value)} autoComplete="off"></input>
    </div>

    <button onClick={()=>{RegisterAction()}} className="btn">Register</button>
</div>
</div>

    );
};

export default Register;