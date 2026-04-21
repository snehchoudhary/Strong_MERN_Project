import { useState, useEffect } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

function Projects() {

    const [showForm, setShowForm] = useState(false);
    const[name, setName]= useState("");
    const [ description, setDescription] = useState("");
    const [projects, setProjects] = useState([]);

    //fetch project on load
    useEffect(() => {
        fetchProjects();
    }, []);

    //fetch function
    const fetchProjects = async () => {
        try {
            const res = await api.get("/projects");

            setProjects(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    //create project
    // const handleCreate = async () => {

    //     try {
    //         await api.post("/projects", {
    //             name, 
    //             description
    //         });

    //         alert("Project Created");

    //         setShowForm(false);
    //         fetchProjects();  //refresh list
    //     } catch (error) {
    //         alert("Error creating project");
    //     }
    // };


    //error checking : 
    const handleCreate =async () => {
        try {
            const res =await api.post("/projects", {
                name, 
                description
            });

            console.log ("Project Created:" ,res.data);
            
            alert("Project Created");

            setShowForm(false);

            setName("");
            setDescription("");
        } catch (error) {
            console.log("Create Error:" , error.response?.data);

            alert("Error creating project");
        }
    }

   return (
    <DashboardLayout>
        <h2 className="text-2xl font-bold mb-6">
            Projects
        </h2>

        <button 
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700">
            + Create Project
        </button>


       {/* form */}
        {showForm && (
            <div className="bg-white p-6 rounded shadow-md w-96">

                <input type="text"
                placeholder="Project Name"
                className="w-full p-2 border mb-4"
                onChange={(e) => 
                    setName(e.target.value)
                } />

                <textarea 
                placeholder="Description"
                className="w-full p-2 border mb-4"
                onChange={(e) => 
                    setDescription(e.target.value)
                }
                />

                <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded">Create</button>

            </div>
        )}

        {/* display projects */}
        <div className="grid gap-4">
            {projects.map((project) => (
                <div 
                key={project._id}
                className="bg-white p-4 rounded shadow">

                 <h3 className="font-bold text-lg">{project.name}</h3>

                 <p className="text-gray-600">{project.description}</p>
                </div>
            ))}

        </div>
    </DashboardLayout>
   )
}

export default Projects;