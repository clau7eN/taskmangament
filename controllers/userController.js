const User = require('../models/users.js')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

exports.registration = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({email: req.body.email})
    if (existingUser) {
      return res.send('Эта почта уже занята!')
    }

    const user = new User ({email, password})
    await user.save()
    res.status(201).send('Успешно зарегистрован!') 
  } catch (e) {console.log('Ошибка!', e), res.status(500).send('Ошибка при регистрации!');}
}

exports.auth = async (req, res) => {
  const {email, password} = req.body
  
  try {
    const user = await User.findOne({email})
    if(!user) res.status(400).send('пользователь не найден!');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) res.status(400).send('Неверный пароль!')
    
    const token = jwt.sign({ id: user._id }, secretKey, {expiresIn: '1h'})
    res.json({token});
  } catch (e) {console.log('Ошибка авторизации', e)}
}

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Нет токена!');

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Токен не подошел!');
    }

    req.user = decoded;
    next();
  })
}

exports.deleteUser = async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id)
  if (!deletedUser) {
    return res.send('Пользователь не найден!')
  }
  res.status(400).send('Успешно удален!')
}