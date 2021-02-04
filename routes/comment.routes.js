const routes = require('express').Router();
const commentController = require('../controllers/comment.controller');
const authenthication = require('../middlewares/checkAuth');

routes.use(authenthication.checkAuth);
routes.post("/post/:postId", commentController.postComment);

module.exports = routes;