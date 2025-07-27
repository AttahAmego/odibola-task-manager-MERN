// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import Tasks from './pages/Tasks' // or wherever your main component is

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Tasks />
  </React.StrictMode>
)
