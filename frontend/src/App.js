import React, { useState } from 'react'
import './App.css'
import EmailDownload from './components/EmailDownload'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Email Downloader</h1>
      </header>
      <EmailDownload />
    </div>
  )
}

export default App
