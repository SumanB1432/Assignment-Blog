const express = require('express');
const userController  = require("../controllers/userController");
const blogController = require("../controllers/blogController")

const router = express.Router();


router.post('/user', userController.createUser);
router.post("/user/login",userController.loginUser)

router.post("/createblog",blogController.createBlog)


module.exports = router;