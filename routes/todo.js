const express = require('express');
const todoRouter = express.Router();
const Todo = require('../models/Todo');
const authenticateToken = require('../middleware/authToken');


todoRouter.post('/create', authenticateToken, async (req, res) => {
    try {
        const { title, description, priority, category, status, userId } = req.body;
        const date = new Date();
        const todo = new Todo({ title, description, priority, category, status, date, userId });
        await todo.save();
        res.json({ message: 'Todo created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create todo' });
    }
})

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

todoRouter.put('/update/:id', authenticateToken, async (req, res) => {
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