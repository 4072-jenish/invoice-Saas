const express = require('express');
const { creatInvoice, allInvoice, getInvoice, editInvoice, deleteInvoice } = require('../Controller/invoieController');

const invoiceRouter = express.Router();

invoiceRouter.post('/creatInvoice' ,creatInvoice);
invoiceRouter.get('/getAllInvoice' ,allInvoice);
invoiceRouter.get('/getInvoice' ,getInvoice);
invoiceRouter.put('/editInvoice/:id' ,editInvoice);
invoiceRouter.delete('/deleteInvoice/:id' ,deleteInvoice);

module.exports = invoiceRouter; 