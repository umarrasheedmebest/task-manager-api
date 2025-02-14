const express = require('express')
const Tasks = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Tasks({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/tasks', auth, async (req, res) => {
    let completed = false;

    if (req.query.completed) {
        completed = req.query.completed === 'true'
    }

    try {
        const limit = parseInt(req.query.limit) || 10; // Default to 10
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const sortOrder = req.query.sort === 'asc' ? 1 : -1; // Default to descending

        const tasks = await Tasks.find({ owner: req.user._id, completed })
            .sort({ createdAt: sortOrder })
            .limit(limit)
            .skip((page - 1) * limit); // Skip based on page number
        res.send(tasks)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Tasks.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Tasks.findOne({ _id, owner: req.user._id })
        // const task = await Tasks.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Tasks.findOneAndDelete({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router