// Define the behavior and routes
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')
const User = require('../models/user')

// GET: Read all blogs
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

// POST: Create new blogs
blogsRouter.post('/', middleware.tokenExtractor, async (request, response, next) => {
    const body = request.body
    try {
        console.log('Token received', request.token)
        // Check if the token is present
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'Token invalid' })
        }
        const user = await User.findById(decodedToken.id)
        // Check if the user exists
        if (!user) {
            return response.status(400).json({ error: 'UserId missing or not valid' })
        }
        // Check if title and url are present
        if (!body.title || !body.url) {
            return response.status(400).json({ error: 'Title or url missing' })
        } 
        // Create a new blog with the user reference
        const blog = new Blog({
            ...body,
            likes: body.likes || 0,
            user: user._id
        })
        // Save the blog and update the user's blogs
        const result = await blog.save()
        user.blogs = user.blogs.concat(result._id)
        await user.save()

        const populatedBlog = await result.populate('user', { username: 1, name: 1 })
        response.status(201).json(populatedBlog)
    } catch (error) {
        next(error)
    }
})

// DELETE: Remove a blog
blogsRouter.delete('/:id', middleware.tokenExtractor, async (request, response, next) => {
    try {
        // Check if the token is present
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }
        // Get the user and the blog to be deleted
        const user = await User.findById(decodedToken.id)
        const blog = await Blog.findById(request.params.id)
        // Check if the blog exists
        if (!blog) {
            return response.status(404).end()
        }
        // Check if the user is the creator of the blog
        if (blog.user.toString() !== user._id.toString()) {
            return response.status(401).json({ error: 'only the creator can delete this blog' })
        }

        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

// PUT: Update a blog
blogsRouter.put('/:id', async (request, response, next) => {
    const { title, author, url, likes } = request.body

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            request.params.id,
            { title, author, url, likes },
            { new: true, runValidators: true, context: 'query' }
        ).populate('user', { username: 1, name: 1 })

        if (!updatedBlog) {
            return response.status(404).end()
        }
        response.json(updatedBlog)
    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter