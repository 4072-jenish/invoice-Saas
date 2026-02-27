const express = require('express');
const auth = require('../Middleware/authMiddleware');
const { creatInvoice, allInvoice, generateInvoicePDF, getInvoice, editInvoice, deleteInvoice } = require('../Controller/invoieController');

const invoiceRouter = express.Router();

invoiceRouter.post('/creatInvoice' , auth ,creatInvoice);
invoiceRouter.get('/getAllInvoice' , auth ,allInvoice);
invoiceRouter.get('/getInvoice' , auth ,getInvoice);
invoiceRouter.get('/editInvoice' , auth ,editInvoice);
invoiceRouter.get('/deleteInvoice' , auth ,deleteInvoice);

module.exports = invoiceRouter; 