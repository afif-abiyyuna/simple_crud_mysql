const routes = require('express').Router();
const imageController = require('../controllers/image.controller');
const imageUploader = require('../helpers/imageUploader');
const authenthication = require('../middlewares/checkAuth');

routes.post('/upload', authenthication.checkAuth, imageUploader.upload.single('image'), imageController.uploadImage);


module.exports = routes;