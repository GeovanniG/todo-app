require('dotenv');
const path = require('path');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
require('./db/mongoose');
const userRouter = require('./routers/user');
const todoRouter = require('./routers/todo');

const viewsPath = path.join(__dirname, './views');
const publicDirectoryPath = path.join(__dirname, '../public');
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

// Routers
app.use(userRouter);
app.use(todoRouter);

app.use(express.static(publicDirectoryPath));
app.set('views', viewsPath);
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});