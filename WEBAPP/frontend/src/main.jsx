import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import CustomToaster from "./components/CustomToaster";

createRoot(document.getElementById('root')).render(
  <>
    <CustomToaster/>
    <App />
  </>
  ,
)
