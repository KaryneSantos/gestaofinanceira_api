require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const session = require("express-session");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize.sync({ force: false}).then(() => {
    console.log('Banco de dados sincronizado.');
}).catch(error => {
    console.error('Erro ao sincronizar o banco de dados:', error);
});

app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, 
    }
}));


const userRouter = require('./routes/user');
app.use('/users', userRouter);

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const despesasRouter = require('./routes/despesas');
app.use('/despesas', despesasRouter);

const rendaRouter = require('./routes/renda');
app.use('/renda', rendaRouter);


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});