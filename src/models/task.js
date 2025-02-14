const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        requried: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' //creating a relationship between
    }
}, {
    timestamps: true,
})

//task model
const Task = mongoose.model('Tasks', taskSchema)

module.exports = Task
