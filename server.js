const express = require('express');
const app = express();
require('dotenv').config()
const PORT = process.env.PORT;
const AuthRouter = require('./Routes/auth.routes.js');
const UserRouter = require('./Routes/user.routes.js');
const PostRouter = require('./Routes/post.routes.js');


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//connect database
require('./database');

app.use(AuthRouter);

app.use(UserRouter);

app.use(PostRouter);

app.listen(PORT, () => {
    console.log('Server is running in port:' + PORT);
})


module.exports = app;