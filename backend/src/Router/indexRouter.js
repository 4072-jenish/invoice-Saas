const express = require('express');
const authRouter = require('./authRouter');
const busRouter = require('./businessRouter');
const invoiceRouter = require('./invoiceRouter');
const custRouter = require('./cusRoutes');
const auth = require('../Middleware/authMiddleware');
const { generateInvoicePDF } = require('../Controller/invoieController');
const indexRouter = express.Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/bus', busRouter);
indexRouter.use('/customer', custRouter);
indexRouter.use('/invoice', invoiceRouter);
indexRouter.get('/:id/generateInvoicePDF' , auth ,generateInvoicePDF);


module.exports = indexRouter; 