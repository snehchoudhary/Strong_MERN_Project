import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"

 import Projects from "./pages/Projects"
 import Upload from "./pages/Upload"
 import Analytics from "./pages/Analytics"

import ProtectedRoute from "./components/protectedRoute";

function App() {
 
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
          <Dashboard/>
          </ProtectedRoute>
          }/>
         <Route path="/projects" element={
          <ProtectedRoute>
          <Projects/>
          </ProtectedRoute>
          }/>
        <Route path="/upload" element={
          <ProtectedRoute>
          <Upload/>
          </ProtectedRoute>
          }/>
        <Route path="/analytics" element={
          <ProtectedRoute>
          <Analytics/>
          </ProtectedRoute>
          }/> 

          <Route 
          path="/tasks"
          element={<Tasks/>}
          />


      </Routes>
    </BrowserRouter>
  );
}

export default App
