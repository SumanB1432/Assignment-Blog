const express = require('express');
const userController  = require("../controllers/userController");
const blogController = require("../controllers/blogController");
const middleware = require("../middleware/auth")

const router = express.Router();


router.post('/user', userController.createUser);
router.post("/user/login",userController.loginUser)

router.post("/createblog",blogController.createBlog)
router.delete("/delete/blog",middleware.Authentication,blogController.deleteBlog)
router.get("/blog/get",blogController.filterBlog);
router.put("/blog/update/:blogId",blogController.updateBlog)


module.exports = router;