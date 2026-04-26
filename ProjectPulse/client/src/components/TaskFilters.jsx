import { useState } from "react";

function TaskFilters({ onFilter }) {

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const handleSubmit =
    (e) => {

      e.preventDefault();

      onFilter({
        search,
        status
      });

    };

  return (

    <form
      onSubmit={handleSubmit}
      className="flex gap-3 mb-4"
    >

      {/* Search */}

      <input
        type="text"
        placeholder="Search task..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="border px-3 py-2 rounded"
      />

      {/* Status Filter */}

      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
        className="border px-3 py-2 rounded"
      >

        <option value="">
          All Status
        </option>

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

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 rounded"
      >

        Apply

      </button>

    </form>

  );

}

export default TaskFilters;