import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../services/api";

function Tasks() {

  const [tasks, setTasks] = useState([]);

  const [filter, setFilter] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [sortBy, setSortBy] =
    useState("name");

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const tasksPerPage = 5;

  /* ===========================
     FETCH TASKS
  =========================== */

  const fetchTasks = async () => {

    try {

      const params = {

        status:
          filter !== "all"
            ? filter
            : undefined,

        search:
          search || undefined,

        sortBy

      };

      const query =
        new URLSearchParams(
          params
        ).toString();

      const res =
        await api.get(
          `/tasks?${query}`
        );

      setTasks(res.data);

    }

    catch (error) {

      console.error(error);

    }

  };

  /* ===========================
     AUTO FETCH
  =========================== */

  useEffect(() => {

    fetchTasks();

  }, [filter, search, sortBy]);

  /* ===========================
     DELETE TASK
  =========================== */

  const deleteTask =
    async (id) => {

      try {

        await api.delete(
          `/tasks/${id}`
        );

        fetchTasks();

      }

      catch (error) {

        console.log(error);

      }

    };

  /* ===========================
     UPDATE STATUS
  =========================== */

  const updateStatus =
    async (id, status) => {

      try {

        await api.put(
          `/tasks/${id}`,
          { status }
        );

        fetchTasks();

      }

      catch (error) {

        console.log(error);

      }

    };

  /* ===========================
     EXCEL UPLOAD
  =========================== */

  const handleFileUpload =
    async (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      try {

        await api.post(
          "/tasks/upload",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );

        alert(
          "Excel uploaded successfully"
        );

        fetchTasks();

      }

      catch (error) {

        console.error(error);

        alert(
          "Upload failed"
        );

      }

    };

  /* ===========================
     SORTING
  =========================== */

  const sortedTasks =
    [...tasks].sort((a, b) => {

      if (sortBy === "name")
        return a.name.localeCompare(b.name);

      if (sortBy === "status")
        return a.status.localeCompare(b.status);

      if (sortBy === "progress")
        return a.progress - b.progress;

      return 0;

    });

  /* ===========================
     PAGINATION
  =========================== */

  const indexOfLastTask =
    currentPage * tasksPerPage;

  const indexOfFirstTask =
    indexOfLastTask - tasksPerPage;

  const currentTasks =
    sortedTasks.slice(
      indexOfFirstTask,
      indexOfLastTask
    );

  /* ===========================
     UI
  =========================== */

  return (

    <DashboardLayout>

      <h2 className="text-2xl font-bold mb-6">
        Tasks
      </h2>

      {/* Excel Upload */}

      <div className="mb-4">

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="border p-2"
        />

      </div>

      {/* Filter */}

      <select
        className="mb-4 p-2 border"
        onChange={(e) => {

          setFilter(
            e.target.value
          );

          setCurrentPage(1);

        }}
      >

        <option value="all">
          All
        </option>

        <option value="completed">
          Completed
        </option>

        <option value="pending">
          Pending
        </option>

        <option value="in-progress">
          In Progress
        </option>

      </select>

      {/* Search + Sort */}

      <div className="flex gap-2 mb-4">

        <input
          type="text"
          placeholder="Search tasks..."
          className="border p-2 w-full"
          value={search}
          onChange={(e) => {

            setSearch(
              e.target.value
            );

            setCurrentPage(1);

          }}
        />

        <select
          className="border p-2"
          onChange={(e) => {

            setSortBy(
              e.target.value
            );

            setCurrentPage(1);

          }}
        >

          <option value="name">
            Sort by Name
          </option>

          <option value="status">
            Sort by Status
          </option>

          <option value="progress">
            Sort by Progress
          </option>

        </select>

      </div>

      {/* Table */}

      <div className="bg-white rounded shadow">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">
                Task
              </th>

              <th className="p-3">
                Status
              </th>

              <th className="p-3">
                Progress
              </th>

              <th className="p-3">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {currentTasks.map(
              (task) => (

                <tr
                  key={task._id}
                  className="border-t"
                >

                  {/* Task Name */}

                  <td className="p-3">

                    {task.name}

                  </td>

                  {/* Status */}

                  <td className="p-3">

                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateStatus(
                          task._id,
                          e.target.value
                        )
                      }
                      className="border p-1"
                    >

                      <option value="pending">
                        Pending
                      </option>

                      <option value="in-progress">
                        In Progress
                      </option>

                      <option value="completed">
                        Completed
                      </option>

                    </select>

                  </td>

                  {/* Progress */}

                  <td className="p-3">

                    <div className="w-full bg-gray-200 rounded">

                      <div
                        className="bg-blue-600 text-white text-xs text-center rounded"
                        style={{
                          width:
                            task.progress + "%"
                        }}
                      >

                        {task.progress}%

                      </div>

                    </div>

                  </td>

                  {/* Actions */}

                  <td className="p-3 text-center">

                    <button
                      onClick={() =>
                        deleteTask(task._id)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >

                      Delete

                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

        {/* Pagination */}

        <div className="flex justify-center mt-4 gap-2">

          <button
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
            disabled={
              currentPage === 1
            }
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
              indexOfLastTask >=
              sortedTasks.length
            }
            className="px-3 py-1 border"
          >

            Next

          </button>

        </div>

      </div>

    </DashboardLayout>

  );

}

export default Tasks;