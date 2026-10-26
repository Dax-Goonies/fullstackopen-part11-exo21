import { Link } from 'react-router-dom'

// Blog component to display individual blog information
const Blog = ({ blog }) => (
  <li data-testid="blog">
    <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
  </li>
)

export default Blog