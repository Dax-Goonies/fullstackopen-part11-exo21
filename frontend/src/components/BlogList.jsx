import Blog from './Blog'

// List of blogs component
const BlogList = ({ user, blogs }) => (
  <div>
    <h2>blogs</h2>
    {user && (
      <>
        <p>{user.name} logged in</p>
      </>
    )}
    <ul>
      {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} user={user} />
      )}
    </ul>

  </div>
)

export default BlogList