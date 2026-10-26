// Togglable component (Not used at the moment)
import { useState } from 'react'

const Togglable = ({ buttonLabel, hideLabel = 'cancel', children }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }
  const hideWhenVisible = { display: visible ? 'none' : '' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        <button onClick={toggleVisibility}>{hideLabel}</button>
        {children}
      </div>
    </div>
  )
}

export default Togglable