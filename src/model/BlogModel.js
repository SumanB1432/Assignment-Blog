let mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim:true
    },
    content: {
        type: String,
        required: true,
        trim:true

    },
    blogImage:{
        type:String,

    },
    userName:{
        type:String,
        ref:"User",
        required:true

    },
    
    userId: {
        type: ObjectId,
        ref: "User",
        required: true
    },

  
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }


},
    { timestamps: true })

module.exports = mongoose.model("Blog", blogSchema)