const express = require('express');
const authRouter = require('./authRouter');
const busRouter = require('./businessRouter');
const invoiceRouter = require('./invoiceRouter');
const custRouter = require('./cusRoutes');
const auth = require('../Middleware/authMiddleware');
const { generateInvoicePDF } = require('../Controller/invoieController');
const productRouter = require('./productRouter');
const indexRouter = express.Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/bus', auth ,busRouter);
indexRouter.use('/customer', auth ,custRouter);
indexRouter.use('/invoice', auth ,invoiceRouter);
indexRouter.use('/products', auth ,productRouter);
indexRouter.get('/:id/generateInvoicePDF' , auth ,generateInvoicePDF);


module.exports = indexRouter; 