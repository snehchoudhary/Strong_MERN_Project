import DashboardLayout from "../layouts/DashboardLayout";
import {useEffect, useState} from "react";
import api from "../services/api";

function Tasks() {

    const[tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [currentPage, setCurrentPage] = useState(1);

    const tasksPerPage = 5;

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks =async () => {
        try {

            const res = await api.get("/tasks");

            setTasks(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete (
                `/tasks/${id}`
            );

            fetchTasks();
        } catch (error) {
            console.log (error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put (
                `/tasks/${id}`,
                {status}
            );
            fetchTasks();
        } catch (error) {
            console.log(error);
        }
    };

    //filtering
    // const filteredTasks = tasks.filter(task => {
    //     if (filter === "all")
    //         return true;

    //     return task.status === filter;
    // });

    const filteredTasks = tasks.filter(task => {

        const matchesSearch = 
        task.name.toLowerCase().include(search.toLowerCase());

        const matchesFilter = filter === "all" ? true : task.status === filter;

        return (
            matchesSearch && matchesFilter
        );
    });

    //sort data
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        
        if (sortBy === "name")
            return a.name.localeCompare(b.name);

        if (sortBy === "status")
            return a.status.localeCompare(b.status);

        if (sortBy === "progress")
            return (
        a.progress - b.progress);

        return 0;
    })



    // Pagination logic
    const indexOfLastTask = currentPage*tasksPerPage;

    const indexOfFirstTask = indexOfLastTask - tasksPerPage;

    const currentTasks = sortedTasks.slice (
        indexOfFirstTask, indexOfLastTask
    );

    return (
        <DashboardLayout>
            <h2 className="text-2xl font-bold mb-6">
                Tasks
            </h2>



            {/* Filter */}
            <Select className="mb-4 p-2 border"
            onChange={(e) => 
                setFilter(e.target.value)
            }
            >
                <option value="all">All</option>

                <option value="completed">
                    Completed
                </option>

                <option value="pending">
                    Pending
                </option>

                <option value="in-progress">
                    In Progress
                </option>

            </Select>

        {/* Wrap search + sort together */}

        <div className="flex gap-2 mb-4">

        
           <input type="text"
           placeholder="Search tasks..."
           className="border p-2 mb-4 w-full"
           value={search}
           onChange={(e) => 
            setSearch(e.target.value)
           } />


           {/* Add sorting dropdown */}

              <select
              className="border p-2 mb-4 ml-2"
              onChange={(e) => setSortBy(e.target.value)}
              >

                <option value="name">Sort by Name</option>

                <option value="status">Sort by Status</option>

                <option value="progress">Sort by Progress</option>
              </select>

              </div>
            {/* Table */}
            
            <div className="bg-white rounded shadow">

              <table className="w-full">
                
                 <thead className="bg-gray-100">

                    <tr>
                        
                        <th classname="p-3 text-left">Task</th>

                        <th classname="p-3">Status</th>

                        <th className="p-3">
                            Progress
                        </th>

                        <th classname="p-3">
                            Actions
                        </th>
                    </tr>
                 </thead>

                 <tbody>
                    {currentTasks.map(
                        (task) => (
                            <tr 
                            key={task._id}
                            className="border-t">

                                {/* Task Name */}

                                <td className="p-3">{task.name}</td>

                                {/* Status */}

                                <td className="p-3">
                                  <select
                                  value={task.status}
                                  onChange={(e) => updateStatus (
                                    task._id,
                                    e.target.value
                                  )} 
                                  className="border p-1"
                                  >

                                    <option value="pending">Pending</option>

                                    <option value="in-progress"> In Progress</option>

                                    <option value="completed">Completed</option>
                                  </select>
                                </td>

                                {/* Progress bar */}

                                 <td className="p-3">

                                    <div className="w-full bg-gray-200 rounded">

                                        <div className="bg-blue-600 text-white text-xs text-center rounded"
                                        style={{
                                            width: task.progress + "%"
                                        }}> {task.progress}%

                                        </div>

                                    </div>

                                 </td>

                                 {/* Actions */}

                                 <td className="p-3 text-center">

                                    <button
                                    onClick={() => deleteTask(task._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded">
                                        Delete

                                    </button>

                                 </td>
                            </tr>

                        )
                    )}
                 </tbody>
              </table>


              {/* pagination button */}

              <div className="flex justify-center mt-4 gap-2">

                <button 
                onClick={() => 
                    setCurrentPage(
                        currentPage - 1
                    )
                }
                disabled={currentPage === 1}
                className="px-3 py-1 border"
                > 
                Prev

                </button>

                <span>
                    Page {currentPage}
                </span>

                <button
                onClick={() => 
                    setCurrentPage(
                        currentPage + 1
                    )
                }
                disabled={
                    indexOfLastTask >= sortedTasks.length
                }
                className="px-3 py-1 border"
                >
                   Next
                </button>

              </div>
            </div>
        </DashboardLayout>
    )
}

export default Tasks;