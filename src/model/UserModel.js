let mongoose = require("mongoose");
 
const userSchema = new mongoose.Schema({
    fname :{ 
        type:String,
        required:true,
        trim: true
       
    },
    lname:{
       type:String,
       required:true,
       trim: true
    },
    title:{
        type:String,
        enum:["Mr", "Mrs", "Miss"],
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    }
    
},
{timestamps:true})

module.exports = mongoose.model("User",userSchema)