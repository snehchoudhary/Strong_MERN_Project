import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/* Charts */
import StatusPieChart from "../components/StatusPieChart";
import ProgressBarChart from "../components/ProgressBarChart";

function Dashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    tasks: 0,
    completed: 0,
    pending: 0,
    inProgress: 0
  });

  const [recentTasks, setRecentTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    fetchDashboardData();

  }, []);

  /* ===========================
     FETCH DASHBOARD DATA
  =========================== */

  const fetchDashboardData =
    async () => {

      setLoading(true);

      try {

        const statsRes =
          await api.get(
            "/tasks/stats/summary"
          );

        const data =
          statsRes.data;

        const total =
          data.total ||
          data.totalTasks ||
          0;

        const completed =
          data.completed || 0;

        const pending =
          data.pending || 0;

        const inProgress =
          data.inProgress ||
          Math.max(
            total -
            completed -
            pending,
            0
          );

        setStats({
          tasks: total,
          completed,
          pending,
          inProgress
        });

        /* Optional recent tasks fetch */
        try {

          const recentRes =
            await api.get(
              "/tasks?limit=5"
            );

          setRecentTasks(
            recentRes.data || []
          );

        }

        catch {

          setRecentTasks([]);

        }

      }

      catch (error) {

        console.error(
          "Dashboard fetch error:",
          error.response?.data ||
          error.message
        );

      }

      finally {

        setLoading(false);

      }

    };

  /* ===========================
     UI
  =========================== */

  return (

    <DashboardLayout>

      {loading ? (

        <div className="flex items-center justify-center h-64">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>

        </div>

      ) : (

        <>

          {/* Header */}

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-2xl font-bold mb-1">

                Welcome Back 👋

              </h2>

              <p className="text-gray-500">

                Here's what's happening today.

              </p>

            </div>

            {/* Upload Button */}

            <button
              onClick={() =>
                navigate("/upload/projectIdHere")
              }
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow transition"
            >

              Upload Excel 📊

            </button>

          </div>

          {/* Kanban Button */}

          <button
            onClick={() =>
              navigate("/kanban")
            }
            className="bg-purple-600 text-white px-5 py-2 rounded shadow mb-6"
          >

            Open Task Board

          </button>

          {/* KPI Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">

            {/* Total */}

            <div className="bg-white p-4 rounded shadow">

              <h3 className="text-gray-500">

                Total Tasks

              </h3>

              <p className="text-2xl font-bold">

                {stats.tasks}

              </p>

            </div>

            {/* Completed */}

            <div className="bg-white p-4 rounded shadow">

              <h3 className="text-gray-500">

                Completed

              </h3>

              <p className="text-2xl font-bold text-green-600">

                {stats.completed}

              </p>

            </div>

            {/* Pending */}

            <div className="bg-white p-4 rounded shadow">

              <h3 className="text-gray-500">

                Pending

              </h3>

              <p className="text-2xl font-bold text-red-600">

                {stats.pending}

              </p>

            </div>

            {/* In Progress */}

            <div className="bg-white p-4 rounded shadow">

              <h3 className="text-gray-500">

                In Progress

              </h3>

              <p className="text-2xl font-bold text-yellow-600">

                {stats.inProgress}

              </p>

            </div>

          </div>

          {/* Charts Section */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* Pie Chart */}

            <div className="bg-white p-6 rounded shadow">

              <h3 className="font-bold mb-4">

                Task Status Distribution

              </h3>

              <StatusPieChart
                stats={stats}
              />

            </div>

            {/* Bar Chart */}

            <div className="bg-white p-6 rounded shadow">

              <h3 className="font-bold mb-4">

                Task Progress Overview

              </h3>

              <ProgressBarChart
                stats={stats}
              />

            </div>

          </div>

          {/* Recent Tasks */}

          <div className="bg-white p-6 rounded shadow">

            <h3 className="font-bold mb-4">

              Recent Tasks

            </h3>

            <ul>

              {recentTasks.length === 0 ? (

                <li className="text-gray-500 py-2">

                  No recent tasks

                </li>

              ) : (

                recentTasks.map(
                  (task) => (

                    <li
                      key={task._id}
                      className="border-b py-2"
                    >

                      <span className="font-medium">

                        {task.name}

                      </span>

                      <span className="ml-2 text-sm text-gray-500">

                        ({task.status})

                      </span>

                    </li>

                  )
                )

              )}

            </ul>

          </div>

        </>

      )}

    </DashboardLayout>

  );

}

export default Dashboard;