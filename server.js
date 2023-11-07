const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const dotenv = require('dotenv');
dotenv.config();
const db = require('./db');
const authRoute = require('./routes/auth');
const todoRoute = require('./routes/todo');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/todo', todoRoute);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})