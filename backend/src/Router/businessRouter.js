const express = require('express');
const { addBusiness } = require('../Controller/businessController');
const auth = require('../Middleware/authMiddleware');

const busRouter = express.Router();

busRouter.use('/addBusiness' , auth ,addBusiness);


module.exports = busRouter;