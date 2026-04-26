import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ProgressBarChart({ stats }) {
  const data = [
    { name: "Completed", value: stats.completed || 0 },
    { name: "Pending", value: stats.pending || 0 },
    { name: "In Progress", value: stats.inProgress || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#3b82f6" name="Tasks" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ProgressBarChart;

