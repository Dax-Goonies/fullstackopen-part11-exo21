import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Typography } from '@mui/material'

const StyledView = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 15px;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`

const Row = styled.div`
  margin-bottom: 10px;
`

const ButtomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const StyledLike = styled.button`
  background: white;
  color: dodgerblue;
  padding: 8px 16px;
  border: 1px solid dodgerblue;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  text-transform: uppercase;
  &:hover {
    background: dodgerblue;
    color: white
  }
`

const StyledRemove = styled.button`
  background: white;
  color: crimson;
  padding: 8px 16px;
  border: 1px solid crimson;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  text-transform: uppercase;
  &:hover {
    background: crimson;
    color: white
  }
`

// Single blog detail component
const BlogView = ({ blogs, handleLike, handleDelete, user }) => {
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return <div>blog not found</div>
  }

  const showRemoveButton = user && blog.user && user.username === blog.user.username

  return (
    <StyledView>
      <h2>{blog.author}: {blog.title}</h2>
      <Row>
        <Typography variant="body2" color="textSecondary">
          by {blog.author}
        </Typography>
      </Row>
      <Row>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
      </Row>
      <Row>
        <Typography variant="body2" color="textSecondary">
          Added by {blog.user?.name}
        </Typography>
      </Row>
      <ButtomRow>
        <Typography variant="subtitle1">{blog.likes} likes</Typography>
        {user && <StyledLike onClick={() => handleLike(blog)}>like</StyledLike>}
        {showRemoveButton &&
          <StyledRemove onClick={() => handleDelete(blog)}>remove</StyledRemove>
        }
      </ButtomRow>
    </StyledView>
  )
}

export default BlogView