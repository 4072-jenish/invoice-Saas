const express = require('express');
const { addCustomer, allCustomers, getCustomer, editCustomer, deleteCustomer } = require('../Controller/customerController');
const auth = require('../Middleware/authMiddleware');

const custRouter = express.Router();

custRouter.post('/addCustomer', auth ,addCustomer);
custRouter.get('/allCustomer', auth ,allCustomers);
custRouter.get('/getCustomer/:id', auth ,getCustomer);
custRouter.put('/editCustomer/:id', auth ,editCustomer);
custRouter.delete('/deleteCustomer/:id', auth ,deleteCustomer);

module.exports = custRouter;