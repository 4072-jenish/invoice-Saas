const express = require('express');
const auth = require('../Middleware/authMiddleware');
const { creatInvoice, allInvoice, getInvoice, editInvoice, deleteInvoice } = require('../Controller/invoieController');

const invoiceRouter = express.Router();

invoiceRouter.post('/creatInvoice' , auth ,creatInvoice);
invoiceRouter.get('/getAllInvoice' , auth ,allInvoice);
invoiceRouter.get('/getInvoice' , auth ,getInvoice);
invoiceRouter.put('/editInvoice/:id' , auth ,editInvoice);
invoiceRouter.delete('/deleteInvoice/:id' , auth ,deleteInvoice);

module.exports = invoiceRouter; 