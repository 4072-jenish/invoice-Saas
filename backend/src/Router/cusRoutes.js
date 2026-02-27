const express = require('express');
const { addCustomer, allCustomers, getCustomer, editCustomer, deleteCustomer } = require('../Controller/customerController');
const auth = require('../Middleware/authMiddleware');

const custRouter = express.Router();

custRouter.post('/addCustomer', auth ,addCustomer);
custRouter.get('/allCustomer', auth ,allCustomers);
custRouter.get('/getCustomer', auth ,getCustomer);
custRouter.get('/editCustomer', auth ,editCustomer);
custRouter.get('/deleteCustomer', auth ,deleteCustomer);

module.exports = custRouter;