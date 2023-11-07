const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    priority: Boolean,
    category: String,
    status: String,
    userId: String,
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;