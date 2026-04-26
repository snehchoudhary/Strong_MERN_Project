import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function CreateProject() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [deadline, setDeadline] =
    useState("");

  const [users, setUsers] =
    useState([]);

  const [assignedTo, setAssignedTo] =
    useState("");

  /* ===========================
     FETCH USERS
  =========================== */

  useEffect(() => {

    fetchUsers();

  }, []);

  const fetchUsers =
    async () => {

      try {

        const res =
          await api.get("/users");

        setUsers(res.data);

      }

      catch (error) {

        console.error(
          "User fetch error:",
          error
        );

      }

    };

  /* ===========================
     CREATE PROJECT
  =========================== */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await api.post(
          "/projects",
          {

            name,
            description,
            deadline,
            assignedTo

          }
        );

        alert(
          "Project created successfully!"
        );

        navigate("/projects");

      }

      catch (error) {

        console.error(error);

        alert(
          "Failed to create project"
        );

      }

    };

  return (

    <DashboardLayout>

      <h2 className="text-2xl font-bold mb-4">

        Create Project

      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md"
      >

        {/* Project Name */}

        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
          className="w-full border p-2 rounded"
        />

        {/* Description */}

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          required
          className="w-full border p-2 rounded"
        />

        {/* Deadline */}

        <input
          type="date"
          value={deadline}
          onChange={(e) =>
            setDeadline(e.target.value)
          }
          required
          className="w-full border p-2 rounded"
        />

        {/* Assign User */}

        <select
          value={assignedTo}
          onChange={(e) =>
            setAssignedTo(
              e.target.value
            )
          }
          required
          className="w-full border p-2 rounded"
        >

          <option value="">

            Select User

          </option>

          {users.map(user => (

            <option
              key={user._id}
              value={user._id}
            >

              {user.name} ({user.role})

            </option>

          ))}

        </select>

        {/* Submit */}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >

          Create Project

        </button>

      </form>

    </DashboardLayout>

  );

}

export default CreateProject;