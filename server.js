const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 4200;
const dbUrl = process.env.DB_URL;

const app = express();
app.use(express.json());

mongoose.connect(dbUrl)
  .then (() => console.log('Успешное подключение к бд!'))
  .catch ((e) => console.log('Неуспешное подключение!', e))

const taskRoutes = require('./routes/taskRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Cервер запущен и работает на ${port}`)
});