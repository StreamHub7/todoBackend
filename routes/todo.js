const express = require('express');
const todoRouter = express.Router();
const Todo = require('../models/Todo');
const authenticateToken = require('../middleware/authToken');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

todoRouter.post('/create', authenticateToken, upload.array('files', 5), async (req, res) => {
    try {
      const { title, description, dueDate, priority, status, userId } = req.body;
      const files = req.files || [];
      const date = new Date();
  
      if (!title || !description || !userId || !dueDate) {
        return res.status(400).json({ error: 'Missing required data.' });
      }
  
      const newTodo = new Todo({
        title,
        description,
        createdAt: date,
        dueDate,
        priority,
        status,
        userId,
        files: files.map(file => ({
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          buffer: file.buffer,
        })),
      });
  
      await newTodo.save();
  
      res.json({ message: 'Todo created with files successfully' });
    } catch (error) {
      console.error('Error creating todo with files:', error);
      res.status(500).json({ error: 'Todo creation failed' });
    }
  });

todoRouter.get('/read/:userId/all', authenticateToken, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.params.userId });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
})

todoRouter.get('/read/:id', authenticateToken, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todo' });
    }
})

todoRouter.put('/update/:id', authenticateToken, upload.array('files'), async (req, res) => {
    try {
      // Extract fields from form-data
      const { title, description, dueDate, priority, status, userId } = req.body;
  
      // Handle files
      const files = req.files.map(file => ({
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer
      }));
  
      const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, {
        title,
        description,
        dueDate,
        priority,
        status,
        userId,
        files
      }, { new: true });
  
      res.json({ message: 'Todo updated successfully', todo: updatedTodo });
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(500).json({ error: 'Failed to update todo' });
    }
});

todoRouter.patch('/update/:id', authenticateToken, async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({message: 'Todo updated successfully', todo});
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todo' });
    }
})

todoRouter.delete('/delete/:id', authenticateToken, async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        res.json({message: 'Todo deleted successfully', todo});
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo' });
    }
})



module.exports = todoRouter;