const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: Date,
    dueDate: Date,
    priority: String,
    status: String,
    userId: String,
    files: [
      {
        originalname: String,
        mimetype: String,
        size: Number,
        buffer: Buffer,
      }
    ],
  });

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;