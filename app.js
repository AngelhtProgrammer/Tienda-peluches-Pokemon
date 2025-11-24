const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const app = express();
const { MONGO_URI } = require('./config');




(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a Mongo DB');
  } catch(error) {
    console.log(error);
  }
})();

// Middleware para parsear JSON y datos de formulario
app.use(cors());
app.use(express.json());
app.use(cookieParser());


//RUTAS FRONTEND

app.use('/', express.static(path.resolve('views', 'home')));
app.use('/styles', express.static(path.resolve('views', 'home', 'styles')));
app.use('/signup', express.static(path.resolve('views', 'home', 'signup')));
app.use('/login', express.static(path.resolve('views', 'home', 'login')));
app.use('/inicio', express.static(path.resolve('views', 'home', 'inicio')));
app.use('/tienda', express.static(path.resolve('views', 'home', 'tienda')));
app.use('/components', express.static(path.resolve('views', 'home', 'Components')));
app.use('/img', express.static(path.resolve('img')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'home', 'verify')));



app.use(morgan('tiny'));

//RUTAS BACKEND
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);



module.exports = app;

