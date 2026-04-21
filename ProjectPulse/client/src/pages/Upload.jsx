import DashboardLayout from "../layouts/DashboardLayout";
import {useEffect, useState} from "react";
import api from "../services/api";
import {toast} from "react-toastify";

function Upload () {

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");

      console.log("Projects fetched:", res.data);

      setProjects(res.data);
    }  catch (error){
      console.log("Fetch Error:", error);
    }
    
  };

  const handleUpload = async () => {
    if (!file  || !selectedProject) {
      alert("Select project and file");
      return;
    }
    try {

      setLoading(true);   //start loading
      const formData = new FormData();

      formData.append("file", file);
      
      formData.append(
        "projectId", 
        selectedProject
      );

      await api.post(
        "/tasks/upload",
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage ("Excel Uploaded Successfully");
    } catch (error) {

      console.log("Upload Error:", error);
      toast.error ("Upload Failed");
    } 
    finally {
      setLoading(false);   //stop loading
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Upload Excel</h2>

      <div className="bg-white p-6 rounded shadow w-96">

        {/* project dropdown */}
        <select 
        className="w-full p-2 border mb-4"
        onChange={(e) => {
          console.log("Selected Project:", e.target.value);
          setSelectedProject(e.target.value)
        }}
        >
          <option value= "">Select Project</option>

          {projects.map((project) => (
            <option
            key={project._id}
            value={project._id}
            >
             {project.name}
            </option>
          ))}
        </select>

        {/* File upload */}


      <div className="mb-4">
       
       <label className="block font-semibold mb-2">Select Excel File</label>

       <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block font-bold"> 📁 Choose Excel File

           <input type="file"
        accept=".xlsx, .xls"
        className="hidden"
        onChange={(e) => {
          console.log("Selected File:" , e.target.files[0]);
        setFile(e.target.files[0])
        }} />
       </label>

       {file && (
        <p className="mt-2 text-sm text-gray-600">
          Selected File: <span className="font-semibold">{file.name}</span>
        </p>
       )}
      </div>
       

        {/* Upload Button */}
        <button
        onClick={handleUpload}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading 
          ? "Uploading..." 
        : "Upload Excel"}</button>

        {message && (
          <p className="text-green-600 mt-4">
            {message}
          </p>
        )}

      </div>
    </DashboardLayout>
  )
};

export default Upload;