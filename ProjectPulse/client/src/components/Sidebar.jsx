import {Link} from "react-router-dom";
import {FaHome, FaProjectDiagram, FaUpload, FaChartBar, FaTasks} from "react-icons/fa";
import {useContext} from "react";
import { AuthContext } from "../context/AuthContext";
import {useNavigate} from "react-router-dom"

function Sidebar() {

  const {logout} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/");
  }


    return(
        <div className="w-64 h-screen bg-slate-900 text-white flex flex-col p-5" >

           <h2 className="flex flex-col gap-4">ProjectPulse</h2>

           <nav className="flex flex-col gap-4">
            <p>
                <Link to="/dashboard" 
                className="flex items-center gap-2 hover:text-blue-400"> <FaHome/> Dashboard</Link>
            </p>

            <p>
                <Link to="/projects" className="flex items-center gap-2 hover:text-blue-400"><FaProjectDiagram/>Projects</Link>
            </p>

          <p>
            <Link to="/upload" className="flex items-center gap-2 hover:text-blue-400"><FaUpload/>Upload</Link>
          </p>

           <p>
            <Link to="/tasks" className="flex items-center gap-2 hover:text-blue-400"><FaTasks/>Tasks</Link>
          </p>

          <p>
            <Link to="/analytics" className="flex items-center gap-2 hover:text-blue-400"><FaChartBar/>Analytics</Link>
          </p>
           </nav>

           <button onClick={handleLogout} className="mt-auto bg-red-500 p-2 rounded hover:bg-red-600">
    Logout
  </button>
        </div>
    )
}

export default Sidebar;