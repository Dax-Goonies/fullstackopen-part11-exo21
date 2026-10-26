import { Alert } from '@mui/material'

// Notifications component
const Notification = ({ message, type }) => {
  if (!message) {
    return null
  }

  return (
    <Alert severity={type === 'error' ? 'error' : 'success'} sx={{ marginTop: 2, marginBottom: 2 }}>
      {message}
    </Alert>
  )
}

export default Notification