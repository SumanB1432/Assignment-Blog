const userModel = require("../model/UserModel");
const joi = require("joi");
const jwt = require("jsonwebtoken")

const isValidtitle = (title) => {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1;
};

const userSchema = joi.object({
  fname: joi.string().required().pattern(new RegExp("^[a-zA-Z]+$")),
  lname: joi.string().required().pattern(new RegExp("^[a-zA-Z]+$")),
  title: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).max(16).required(),
});

/////---------------------------------------------------------createUser---------------------------------------------------------------------

const createUser = async function (req, res) {
  try {
    let data = req.body;
    let err = [];

    const { error, value } = userSchema.validate(data, { abortEarly: false });
    if (error) {
      let errArr = error.details;
      for (let i = 0; i < errArr.length; i++) {
        err.push(errArr[i].message);
      }
      return res.status(400).send({ status: false, message: err });
    }

    //     /******Check Unique Email ****/

    let validEmail = await userModel.findOne({ email: data.email });
    if (validEmail)
      return res
        .status(400)
        .send({ status: false, msg: `${data.email} Already email exist ` });

    if (!isValidtitle(data.title)) {
      return res.status(400).send({
        status: false,
        msg: 'Enter valid enum  ["Mr", "Mrs", "Miss"]',
      });
    }

    let created = await userModel.create(data);
    res.status(201).send({ status: true, data: created });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, msg: err.message });
  }
};


/*************************************LOGIN USER *************************************************************/

const loginUser = async function (req, res) {
  try {
    let data = req.body;

    const loginSchema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(8).max(16).required(),
    });
    let err = [];

    const { error, value } = loginSchema.validate(data, { abortEarly: false });
    if (error) {
      let errArr = error.details;
      for (let i = 0; i < errArr.length; i++) {
        err.push(errArr[i].message);
      }
      return res.status(400).send({ status: false, message: err });
    }

    let checkedUser = await userModel.findOne({
      email: data.email,
      password: data.password,
    });
    if (!checkedUser) {
      return res
        .status(401)
        .send({ status: false, message: "email or password is not correct" });
    }
    let date = Date.now();
    let createTime = Math.floor(date / 1000);
    let expTime = createTime + 3000;

    let token = jwt.sign(
      {
        userId: checkedUser._id.toString(),
        iat: createTime,
        exp: expTime,
      },
      "assignment_blog_sumanBera"
    );

    res.setHeader("x-api-key", token);
    return res
      .status(200)
      .send({ status: true, message: "Success", data: { token: token } });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
