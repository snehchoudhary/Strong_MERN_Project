import { React } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AuthProvider}  from './context/AuthContext.jsx'
import "./index.css";
import {ToastContainer} from "react-toastify";
import "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <AuthProvider>
    <App />
    <ToastContainer/>
  </AuthProvider>
)
