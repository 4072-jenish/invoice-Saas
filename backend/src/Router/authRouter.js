const express = require('express');
const { regUser, loginUser } = require('../Controller/authController');

const authRouter = express.Router();

authRouter.post('/regUser', regUser);
authRouter.use('/login', loginUser);

module.exports = authRouter;    