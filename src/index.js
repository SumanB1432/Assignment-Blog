const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose")
const route = require('./routes/route');

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("hello")
})


mongoose.connect("mongodb+srv://Suman-1432:Suman1432@cluster0.bkkfmpr.mongodb.net/assignment_blog")
.then(()=>{
    console.log("MONGODB IS CONNECTED")
}).catch((err)=>{
    console.log(err)
})

app.use('/', route)

app.listen(process.env.PORT || 3000,(err)=>{
    if(!err){
        console.log(`SERVER RUN ON PORT ${process.env.PORT}
http://localhost:5000`)
    }
})