require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const userRouter = require('./routes/user');
app.use('/user', userRouter);


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});