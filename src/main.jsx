import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/jetbrains-mono/700.css'
import './index.css'
// v29: Lenis disabled — conflicts z CSS scroll-snap-mandatory na <main>.
// Native snap-y daje wymagane "one section per viewport" lock.
// import { initLenis } from './hooks/useLenis.js'
// initLenis()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
