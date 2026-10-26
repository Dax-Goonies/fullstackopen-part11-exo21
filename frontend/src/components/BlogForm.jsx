import { useState } from 'react'
import { BlogInput, StyledButton } from '../styles'

// Blog form component
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <BlogInput
            type="text"
            value={title}
            data-testid="title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder='title'
          />
        </div>
        <div>
          <BlogInput
            type="text"
            value={author}
            data-testid="author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='author'
          />
        </div>
        <div>
          <BlogInput
            type="text"
            value={url}
            data-testid="url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder='url'
          />
        </div>
        <StyledButton type="submit">create</StyledButton>
      </form>
    </div>
  )
}

export default BlogForm