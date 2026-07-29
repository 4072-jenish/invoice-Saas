const express = require('express');
const { addCustomer, allCustomers, getCustomer, editCustomer, deleteCustomer } = require('../Controller/customerController');
const auth = require('../Middleware/authMiddleware');

const custRouter = express.Router();

custRouter.post('/addCustomer' ,addCustomer);
custRouter.get('/allCustomer',allCustomers);
custRouter.get('/getCustomer/:id',getCustomer);
custRouter.put('/editCustomer/:id',editCustomer);
custRouter.delete('/deleteCustomer/:id',deleteCustomer);

module.exports = custRouter;