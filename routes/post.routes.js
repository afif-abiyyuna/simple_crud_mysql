const routes = require('express').Router();
const postController = require('../controllers/post.controller');
const authenthication = require('../middlewares/checkAuth');

routes.post("/create", authenthication.checkAuth, postController.postBlog);
routes.get("/get/:id", postController.blogId);
routes.get("/show/all", postController.allBlog);
routes.get("/get/current", authenthication.checkAuth, postController.showAllCurrrentBlog);
routes.patch("/update/:id", authenthication.checkAuth, postController.updateBlog);
routes.delete("/delete/:id", authenthication.checkAuth, postController.deleteBlog);

module.exports = routes;

