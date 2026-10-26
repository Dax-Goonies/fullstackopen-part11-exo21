const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5
    }
]

let token
let userId

// Setup before each test
beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'blogtestuser', name: 'Blog Test User', passwordHash })
    const savedUser = await user.save()
    userId = savedUser._id

    const loginResponse = await api
        .post('/api/login')
        .send({ username: 'blogtestuser', password: 'salasana' })

    token = loginResponse.body.token

    const blogObjects = initialBlogs.map(blog => new Blog({ ...blog, user: userId }))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

// 4.8: GET tests 
describe('GET /api/blogs', () => {
    test('Blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('Correct number of blogs returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length)
    })
})

// 4.9: Id field test
describe('Blog id field', () => {
    test('Unique identifier is named id not _id', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        response.body.forEach((blog) => {
            assert.ok(blog.id)
            assert.strictEqual(blog._id, undefined)
        })
    })
})

// 4.10: POST test
describe('POST /api/blogs', () => {
    test('A valid blog can be added', async () => {
        const newBlog = {
            title: 'New Blog Post',
            author: 'John Doe',
            url: 'https://example.com/new-blog-post',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        // Verify total count increased by one
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length + 1)

        // Verify title exists in response
        const titles = response.body.map((blog) => blog.title)
        assert.ok(titles.includes('New Blog Post'))
    })
})

// 4.11: Likes test for default value
describe('POST /api/blogs with missing likes property', () => {
    test('f likes property is missing, it defaults to 0', async () => {
        const newBlog = {
            title: 'Blog Without Likes',
            author: 'John Doe',
            url: 'https://example.com/blog-without-likes'
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        // Verify likes defaults to 0
        assert.strictEqual(response.body.likes, 0)
    })
}) 


// 4.12: Bad Request test
describe('POST /api/blogs with missing title and url', () => {
    test('If title and url are missing, respond with 400 Bad Request', async () => {
        const newBlog = {
            author: 'John Doe'
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })
})

// 4.13: Remove blog test
describe('DELETE /api/blogs/:id', () => {
    test('A blog can be deleted', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToDelete = blogsAtStart.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await api.get('/api/blogs')
        assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)
    })
})

// 4.14: Update blog test
describe('PUT /api/blogs/:id', () => {
    test('A blog can be updated', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToUpdate = blogsAtStart.body[0]

        const updatedBlogData = {
            title: 'Updated Blog Title',
            author: 'Jane Doe',
            url: 'https://example.com/updated-blog-post',
            likes: 5
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlogData)
            .expect(200)

        const blogsAtEnd = await api.get('/api/blogs')
        const updatedBlog = blogsAtEnd.body.find((b) => b.id === blogToUpdate.id)
        assert.strictEqual(updatedBlog.title, 'Updated Blog Title')
        assert.strictEqual(updatedBlog.author, 'Jane Doe')
        assert.strictEqual(updatedBlog.url, 'https://example.com/updated-blog-post')
        assert.strictEqual(updatedBlog.likes, 5)
    })
})

after(async () => {
  await mongoose.connection.close()
})