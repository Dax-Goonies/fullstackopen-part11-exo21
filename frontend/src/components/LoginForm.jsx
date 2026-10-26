import { StyledButton, LoginInput } from '../styles'

// Login form component
const LoginForm = ({ handleLogin, username, password, setUsername, setPassword }) => (
  <form onSubmit={handleLogin}>
    <div>
      <LoginInput
        type="text"
        value={username}
        data-testid="username"
        onChange={({ target }) => setUsername(target.value)}
        placeholder='username'
      />
    </div>
    <div>
      <LoginInput
        type="password"
        value={password}
        data-testid="password"
        onChange={({ target }) => setPassword(target.value)}
        placeholder='password'
      />
    </div>
    <StyledButton type="submit">LOGIN</StyledButton>
  </form>
)

export default LoginForm