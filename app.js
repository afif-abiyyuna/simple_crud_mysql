const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const postRoutes = require('./routes/post.routes');
const userRoutes = require('./routes/user.routes');
const imageRoutes = require('./routes/images.routes');
const commentRoutes = require('./routes/comment.routes');
const errorHandler = require('./middlewares/errorHandler');

app.use(bodyParser.json());

app.use('/images', express.static('images'));
app.use('/user/blogs', postRoutes);
app.use('/user', userRoutes);
app.use('/image', imageRoutes);
app.use('/user/comments', commentRoutes);
app.use(errorHandler);


module.exports = app;