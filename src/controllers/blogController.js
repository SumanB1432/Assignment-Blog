const blogModel = require("../model/BlogModel");
const authorModel = require("../model/UserModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const joi = require("joi");
///////////////-----------------------------------------create Blog-------------------------------------------------------///
const blogSchema = joi.object({
  title: joi.string().required(),
  content: joi.string().required(),
  userName: joi.string().required(),
  userId: joi.string().required(),
  isDeleted: joi.boolean().default("false"),
  deletedAt: joi.date(),
});

const createBlog = async function (req, res) {
  try {
    let data = req.body;
    let err = [];

    const { error, value } = blogSchema.validate(data, { abortEarly: false });
    if (error) {
      let errArr = error.details;
      for (let i = 0; i < errArr.length; i++) {
        err.push(errArr[i].message);
      }
      return res.status(400).send({ status: false, message: err });
    }

    if (!mongoose.isValidObjectId(data.userId))
      return res
        .status(400)
        .send({ status: false, msg: "Please enter correct length of user Id" });
    //  console.log(mongoose, 37);

    let get_user = await authorModel.findById(data.userId);

    if (!get_user) {
      return res
        .status(400)
        .send({ status: false, msg: "userId doesn't exist." });
    }

    let user_name = `${get_user.fname} ${get_user.lname}`.toLowerCase();
    // console.log(user_name)
    let req_user = data.userName.toLowerCase();
    if (user_name !== req_user) {
      return res.status(400).send({
        status: false,
        message: "userId and userName dose not matched",
      });
    }
    data = {
      title: data.title.toUpperCase(),
      content: data.content,
      userName: data.userName.toUpperCase(),
      userId: data.userId,
    };

    let saveData = await blogModel.create(data);

    res
      .status(201)
      .send({ status: true, msg: "Blog Created Successfully", saveData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};
///////////////////////---------GET BLOG/FIND BLOG BY KEYWORD---------------//////////////////////////////
const filterBlog = async function (req, res) {
  try {
    let data = req.body;
    let { title, userName, userId, timestamps } = data;

    let filter = {
      isDeleted: false,
    };
    ////////////////////////////------PAGINATION --------------///////////////////////////////////////////////////////////
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 3;
    let skip = (page - 1) * limit;
    console.log(skip);
    ///////////////////////////////////////////////////////////////////////////

    if (title != null) {
      title = title.toUpperCase();
      let verifyCategory = await blogModel.find({ title: title });
      if (verifyCategory == 0) {
        return res
          .status(400)
          .send({ status: false, msg: "No blogs there as the same title" });
      }
      filter["title"] = title.toUpperCase();
    }
    if (userName != null) {
      userName = userName.toUpperCase();
      console.log("hi");
      let verifyCategory = await blogModel.find({ userName: userName });
      if (verifyCategory.length == 0) {
        return res
          .status(400)
          .send({ status: false, msg: "No blog exist for this user name" });
      }
      filter["userName"] = userName.toUpperCase();
    }
    if (userId != null) {
      let verifyCategory = await blogModel.find({ userId: userId });
      if (verifyCategory == 0) {
        return res
          .status(400)
          .send({ status: false, msg: "No blog exist for this userId" });
      }
      filter["userId"] = userId;
    }
    if (timestamps != null) {
      let verifyCategory = await blogModel.find({ createdAt: timestamps });
      if (verifyCategory == 0) {
        return res
          .status(400)
          .send({ status: false, msg: "No blogs in this timestamps exist" });
      }
      filter["createdAt"] = timestamps;
    }
    console.log(filter);

    let getRecord = await blogModel.find(filter).skip(skip).limit(limit);
    if (getRecord.length == 0) {
      return res.status(404).send({
        status: false,
        message: "no such blog found for the given filter",
      });
    }
    console.log(getRecord.length);
    return res.status(200).send({ status: true, message: getRecord });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
////////////////////////----------UPDATE BLOG---------------------////////////////////////////////////
const updateBlog = async function (req, res) {
  try {
    const updateBlogSchema = joi.object({
      title: joi.string(),
      content: joi.string(),
    });
    let data = req.body;
    let blogId = req.params.blogId;

    const { title, content } = data;
    let err = [];

    const { error, value } = updateBlogSchema.validate(data, {
      abortEarly: false,
    });
    if (error) {
      let errArr = error.details;
      for (let i = 0; i < errArr.length; i++) {
        err.push(errArr[i].message);
      }
      return res.status(400).send({ status: false, message: err });
    }

    if (!ObjectId.isValid(blogId)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter correct length of blog Id" });
    }

    let blog_Id = await blogModel.findOne({ _id: blogId, isDeleted: false });

    if (!blog_Id) {
      res.status(400).send({ status: false, msg: " blog Id not found" });
    }
    let update_query = {};

    if (title != null) {
      update_query["title"] = title.toUpperCase();
    }
    if (content != null) {
      update_query["content"] = content;
    }

    let updateBlog = await blogModel.findOneAndUpdate(
      { _id: blogId, isDeleted: false },
      {
        $set: update_query,
      },
      { new: true }
    );

    res.status(200).send({ status: true, data: updateBlog });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

////////////////-----------DELETE BLOG------------------/////////////////////////////////////////////////
const deleteBlog = async function (req, res) {
  try {
    let data = req.params.blogId;
    // let Id = data.blogId
    if (!data) {
      return res
        .status(400)
        .send({ status: false, msg: "BlogId !~ must be provided " });
    }

    if (!ObjectId.isValid(data)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter correct length of blog Id" });
    }

    let BlogId = await blogModel.findById(data);
    if (!BlogId) {
      res.status(404).send({ msg: "Please enter valid blogId" });
    }

    let deletedBlog = await blogModel.findOneAndUpdate(
      { _id: data, isDeleted: false },
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );

    if (!deletedBlog) {
      return res.status(404).send({
        status: false,
        msg: "No Document found or Document has been already deleted",
      }); // edit Blog is deleted
    }

    res.status(200).send({ status: true, msg: deletedBlog });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

exports.createBlog = createBlog;
exports.deleteBlog = deleteBlog;
exports.filterBlog = filterBlog;
exports.updateBlog = updateBlog;
