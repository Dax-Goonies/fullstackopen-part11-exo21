// Define the data structure
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// User Schema
const userSchema = mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        minlength: 3

    },
    name: String,
    passwordHash: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
}) 

// Convert the schema to JSON
userSchema.set('toJSON', {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
        delete returnObject.passwordHash 
    }
})

// User model
const User = mongoose.model('User', userSchema)

module.exports = User