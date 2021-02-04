const routes = require('express').Router();
const userController = require('../controllers/user.controller');
const authenthication = require('../middlewares/checkAuth');

routes.post("/register", userController.register);
routes.post("/login", userController.login);
routes.use(authenthication.checkAuth);
routes.patch("/update", userController.updateProfile);
routes.get("/profile", userController.showProfile);


module.exports = routes;