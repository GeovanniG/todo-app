const express = require('express');
const router = new express.Router();
const Todo = require('../models/todo');
const User = require('../models/user');
const auth = require('../middleware/auth');

router.post('/:id/todo', auth, async (req, res) => {
    const todo = {
        title: req.body.title,
        owner: req.params.id
    };
    if (req.body.description) todo.description = req.body.description;

    Todo.create(todo)
    .then(todo => {
        res.status(201).send(todo);
    })
    .catch(({ name, errmsg, message }) =>
        res.status(400).send({ name, errmsg, message })
    )
})

router.get('/:id/todo', auth, async (req, res) => {
    const user = await User.findById(req.params.id);
    await user.populate('todos').execPopulate(); 
    // or
    // const todos = await Todo.find({ owner: req.params.id })

    res.json(user.todos);
})

router.patch('/:id/todo/', auth, async (req, res) => {
    const allowedUpdates = ['title', 'description'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    
    if (!isValidOperation) return res.json({ name: 'UnknownPropertyError' });
    
    try {
        const todo = await Todo.find({title: req.body.title});
        updates.map((update) => todo[update] = req.body[update]);
        await todo.save()
        res.json(todo);
    } catch (e) {
        res.status(400).json({ name: "UpdateTodoError", ...e});
    }
})

router.delete('/:id/todo/', auth, async (req, res) => {
    try {
        const todo = await Todo.deleteMany({ title: req.body.title });
        res.json(todo);
    } catch (e) {
        res.status(400).json({ name: "DeleteTodoError", ...e })
    }
})



// ONLY FOR TESTING
// Get all todos created by every user
router.get('/todo', async (req, res) => {
    // request data from database
    const todos = await Todo.find({});
    res.json(todos);
})

// Delete all todos created by every user
router.delete('/todo', async (req, res) => {
    const todos = await Todo.deleteMany({});
    res.json(todos);
})

module.exports = router;