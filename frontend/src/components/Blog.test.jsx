import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { MemoryRouter } from 'react-router-dom'

// TEST: Render blog basic informations
test('renders title and author, but not url or likes by default', () => {
  const blog = {
    id: '1',
    title: 'Component testing is done with RTL',
    author: 'Kent C. Dodds',
  }

  render(
    <MemoryRouter>
      <Blog blog={blog} />
    </MemoryRouter>
  )

  const link = screen.getByText('Component testing is done with RTL', { exact: false })

  expect(link).toBeVisible()
  expect(link.closest('a')).toHaveAttribute('href', '/blogs/1')
})

// TEST: Togglable element
describe('<Togglable />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show">
        <div className="testDiv">togglable content</div>
      </Togglable>
    ).container
  })

  test('renders its children', () => {
    expect(screen.getByText('togglable content')).toBeInTheDocument()
  })

  test('at start, children are not displayed', () => {
    const div = container.querySelector('.testDiv')
    expect(div).not.toBeVisible()
  })

  test('children are displayed after clicking the show button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const div = container.querySelector('.testDiv')
    expect(div).toBeVisible()
  })
})

// TEST: Blog form
test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByTestId('title')
  const authorInput = screen.getByTestId('author')
  const urlInput = screen.getByTestId('url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'Testing Forms in React')
  await user.type(authorInput, 'Dax')
  await user.type(urlInput, 'https://example.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing Forms in React')
  expect(createBlog.mock.calls[0][0].author).toBe('Dax')
  expect(createBlog.mock.calls[0][0].url).toBe('https://example.com')
})