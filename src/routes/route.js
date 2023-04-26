const express = require('express');
const userController  = require("../controllers/userController");
const blogController = require("../controllers/blogController");
const middleware = require("../middleware/auth")

const router = express.Router();


router.post('/user', userController.createUser);
router.post("/user/login",userController.loginUser)

router.post("/blogs",blogController.createBlog);
router.get("/blogs",blogController.filterBlog);
router.put("blogs/:blogId",blogController.updateBlog)
router.delete("/blogs/:blogId",middleware.Authentication,blogController.deleteBlog)



module.exports = router;