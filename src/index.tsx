import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

import {initI18n} from './utils/i18n';
initI18n()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
