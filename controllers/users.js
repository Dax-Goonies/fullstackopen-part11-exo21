const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

// Get all users and populate their blogs
userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    response.json(users)
})

// Create a new user with hashed password
userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    // Validate password length
    if (!password || password.length < 3) {
        return response.status(400).json({ 
            error: 'Password must be at least 3 characters long' 
        })
    }

    // Hash the password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create a new user with the hashed password
    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = userRouter