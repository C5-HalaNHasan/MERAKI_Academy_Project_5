const mysql=require("mysql2");


//create the connection to the database:
const connection=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
})

connection.connect((error)=>{
    if(error){
        console.log({errorConnecting:error});
    }
    console.log({connectAsId:connection.threadId})
})

//exporting the db to be used in the index.js BE
module.exports=connection