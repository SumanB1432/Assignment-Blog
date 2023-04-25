const blogModel = require("../model/BlogModel");
const authorModel = require("../model/UserModel");
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const joi  = require("joi")
///////////////-----------------------------------------create Blog-------------------------------------------------------///
 const blogSchema = joi.object({
     title:joi.string().required(),
     content: joi.string().required(),
     userId :joi.string().required(),
     isDeleted:joi.boolean().default("false"),
     deletedAt:joi.date(),

});


const createBlog = async function (req, res) {
    try {
      let data = req.body
      let err = []

      const {error,value} = blogSchema.validate(data,{abortEarly:false})
      if (error) {
        let errArr = error.details;
        for (let i = 0; i < errArr.length; i++) {
          err.push(errArr[i].message);
        }
        return res.status(400).send({ status: false, message: err });
      }
  
  
     
  
      if (!mongoose.isValidObjectId(data.userId))
        return res.status(400).send({ status: false, msg: 'Please enter correct length of user Id' })
        //  console.log(mongoose, 37);
  
  
      let userId = await authorModel.findById(data.userId)
  
      if (!userId) { return res.status(400).send({ status: false, msg: "userId doesn't exist." }) }
  
    
      let saveData = await blogModel.create(data)
  
      res.status(201).send({ status: true, msg: "Blog Created Successfully", saveData })
  
  
  
    }
    catch (err) {
  
      res.status(500).send({ status: false, msg: err.message })
    }
  }
  exports.createBlog = createBlog;