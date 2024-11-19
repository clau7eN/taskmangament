const express = require('express');
const {registration, auth, protect, deleteUser} = require('../controllers/userController.js')
const router = express.Router();

router.post('/registration', registration);
router.post('/auth', auth);
router.get('/protect', protect);
router.delete('/deleteUser/:id', deleteUser);

module.exports = router;