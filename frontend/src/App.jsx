import { useState, useEffect } from 'react'
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import Notification from './components/Notifications'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Handle login form submission
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification('logged in successfully', 'success')
      navigate('/')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  // Handle logout
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    showNotification('logged out successfully', 'success')
    navigate('/')
  }

  // Handle new blog creation
  const createBlog = async (blogObject) => {
    try {
      const savedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(savedBlog))
      showNotification(`a new blog ${savedBlog.title} by ${savedBlog.author} added`)
      navigate('/')
    } catch {
      showNotification('failed to create blog', 'error')
    }
  }

  // Handle liking blog
  const handleLike = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id === blog.id ? returnedBlog : b))
    } catch (error) {
      console.log('Like error:', error)
      console.log('Error response:', error.response)
      console.log('Error response data:', error.response?.data)
      showNotification('failed to update likes', 'error')
    }
  }

  // Handle removing blog
  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        showNotification(`blog ${blog.title} removed`)
        navigate('/')
      } catch {
        showNotification('failed to remove blog', 'error')
      }
    }
  }

  // Notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  // Styling the navigation bar
  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Blog App
            </Typography>
            <Button color="inherit" component={Link} to="/" sx={style}>blogs</Button>{' '}
            {user && <Button color="inherit" component={Link} to="/blogs/new" sx={style}>new blog</Button>}
            {user
              ? <Button color="inherit" onClick={handleLogout} sx={style}>logout</Button>
              : <Button color="inherit" component={Link} to="/login" sx={style}>login</Button>
            }
          </Toolbar>
        </AppBar>

        <Notification message={notification?.message} type={notification?.type} />

        <Routes>
          <Route path="/login" element={
            <div>
              <h2>Log in to application</h2>
              <LoginForm
                handleLogin={handleLogin}
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
              />
            </div>
          } />
          <Route path="/" element={
            <BlogList
              user={user}
              blogs={blogs}
            />
          } />
          <Route path="/blogs/:id" element={
            <BlogView
              blogs={blogs}
              handleLike={handleLike}
              handleDelete={handleDelete}
              user={user}
            />
          } />
          <Route path="/blogs/new" element={<BlogForm createBlog={createBlog} />} />
        </Routes>
      </div>
    </Container>
  )
}

export default App