const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

// Test Login
describe('login', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'daxtest', name: 'Dax Test', passwordHash })

    await user.save()
  })

  // Test cases for login
  test('Succeeds with correct credentials', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'daxtest', password: 'salasana' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.username, 'daxtest')
    assert(result.body.token)
  })

  // Test cases for login failures: password
  test('Fails with 401 if password is wrong', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'daxtest', password: 'wrongpassword' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.toLowerCase().includes('invalid'))
  })

  // Test cases for login failures: username
  test('Fails with 401 if username does not exist', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'nonexistent', password: 'salasana' })
      .expect(401)

    assert(result.body.error.toLowerCase().includes('invalid'))
  })
})

after(async () => {
  await mongoose.connection.close()
})