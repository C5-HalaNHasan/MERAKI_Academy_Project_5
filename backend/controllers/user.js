const connection=require("../models/db");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");


// a function to add a new user to the data base
const createUser=async (req,res)=>{
    //user data is collected then the password is hashed before being saved in the database
    const {firstName,lastName,email,password,birthday,country,gender,role_id}=req.body;
    const query=`INSERT INTO user(firstName,lastName,email,password,birthday,country,gender,role_id) VALUES(?,?,?,?,?,?,?,?)`
    const SALT=10;
    const hashedPassword=await bcrypt.hash(password,SALT);
    const data=[firstName,lastName,email,hashedPassword,birthday,country,gender,role_id];
    //before registration: the entered email is going to be checked if it exists in the dataBase or not:
    const query1=`SELECT * FROM user WHERE email=?`
    const data1=[email];
    connection.query(query1,data1,(error1,result1)=>{
        if(error1){
            return res.status(500).json({
                success:false,
                message:error1.message,
            })
        };
        //if the result is an empty array then the email doesn't ecist in the data base
        if(!result1.length){
            //create new connection to register the user:
            connection.query(query,data,(error,result)=>{
                if(error){
                    return res.status(500).json({
                        success:false,
                        message:error.message,
                    })
                };
                res.status(201).json({
                    success:true,
                    message:`user created successfully`,
                    result:result,
                })
            });
        }else{ //the entered email exists in the dataBase:
            res.status(406).json({
                success:false,
                message:`this email exists in the dataBase`,
            })
        }
    })
    
};

// a function that logins the user by email & password
const loginUser=(req,res)=>{
    const {email,password}=req.body;
    const query=`SELECT * FROM user WHERE email=?`;
    const data=[email,password]
    //first the user email is checked if it's in the dataBase,
    //if it's in the database: the password is checked if it matches with the one saved in the database
    //if the password is correct: token is created and sent as a response to the user
    connection.query(query,data,(error,result)=>{
        if(error){
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        };
        
        //if the email exists then result.length>0:
        if (result.length > 0) {
        //the password is checked:
            bcrypt.compare(password, result[0].password, (error1, result1) => {
              if (error1){
                return res.status(500).json({
                    success:false,
                    message:error1.message,
                })
              } 
              if ( result1) {
                const payload = {
                  userId: result[0].id,
                  role_id: result[0].role_id, 
                };
                const options={
                    expiresIn:"700m" //! to be updated later
                }
                const secret = process.env.SECRET;
                const token = jwt.sign(payload, secret,options);
                res.status(200).json({ token });
              } else {
                res.status(403).json({
                  success: false,
                  message: "Incorrect password",
                });
              }
            });
          } else {
            res.status(404).json({ 
                  success: false, 
                  message: "This email doesn't exist in the dataBase" 
                });
          }
    })
};

module.exports={
    createUser,
    loginUser,
}

