import DashboardLayout from "../layouts/DashboardLayout";
import {useEffect, useState} from "react";
import api from "../services/api"

import{
    Pie,
    Bar
} from "react-chartjs-2";

import {
    Chart as ChartJs,
    ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement
} from "chart.js";

ChartJs.register (
    ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement
)


function Analytics ()  {

    const [stats, setStats] = useState({
        totla: 0,
        completed: 0,
        pending: 0,
        inProgress: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {

            const res = await api.get("/tasks/stats");

            setStats(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    //pie chart data
    const pieData = {
        labels: [
            "Completed",
            "Pending",
            "In Progress"
        ], 
        datasets: [
            {
                data: [
                    stats.completed,
                    stats.pending,
                    stats.inProgress
                ],
                backgroundColor: [
                    "#22c55e", 
                    "#ef4444",
                    "#f59e0b"
                ]
            }
        ]
    };

    //bar chart data
    const barData = {
        labels : [
            "Completed",
            "Pending",
            "In Progress"
        ],
        datasets: [{
            label: "Tasks",

            data: [
                stats.completed,
                stats.pending,
                stats.inProgress
            ],
            backgroundColor: "#3b82f6"
        }]
    };

    return (
        <DashboardLayout>
            <h2 className="text-2xl font-bold mb-6">
                Analytics Dashboard
                </h2>

                {/* KPI Cards */}

                <div className="grid grid-cols-3 gap-4 mb-6">

                    <div className="bg-white p-4 rounded shadow text-center">

                        <h3 className="text-gray-500">Total Tasks</h3>

                       <p className="text-2xl font-bold">{stats.total}</p>
                    </div>


                 <div className="bg-white p-4 rounded shadow text-center">

                     <h3 className="text-gray-500">Completed</h3>

                     <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                 </div>

                 <div className="bg-white p-4 rounded shadow text-center">

                    <h3 className="text-gray-500">Pending</h3>

                    <p className="text-2xl font-bold text-red-600">{stats.pending}</p>

                 </div>
                </div>

                {/* Charts */}

                <div className="grid grid-cols-2 gap-6">

                {/* Pie chart */}

                <div className="bg-white p-6 rounded shadow">

                    <h3 className="font-bold mb-4">Task Status Distribution</h3>

                    <Pie data={pieData}/>

                </div>

                {/* Bar CHart */}
                <div className="bg-white p-6 rounded shadow">

                 <h3 className="font-bold mb-4">Task Progress Overview</h3>

                 <Bar data={barData}/>
                </div>
                </div>
        </DashboardLayout>
    )
};

export default Analytics;