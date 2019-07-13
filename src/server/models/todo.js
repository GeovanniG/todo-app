const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim:  true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

todoSchema.methods.toJSON = function () {
    const todoObject = this.toObject();

    delete todoObject.owner;

    return todoObject;
}

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;