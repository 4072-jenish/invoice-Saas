require('dotenv').config();
const express = require('express');
const indexRouter = require('./src/Router/indexRouter');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(
  cors({
    origin: [
      "https://invoice-saas-redeploed.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use('/', indexRouter);
 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
