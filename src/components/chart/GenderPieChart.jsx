import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#FF8042", "#00C49F"]; // Couleurs pour F, M, O

const GenderPieChart = ({ apiData }) => {
  if (!apiData || apiData.status !== "success") return null;

  // Transformation des données pour Recharts
  const data = Object.entries(apiData.data.by_gender).map(([gender, stats]) => ({
    name: gender,
    value: stats.total,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={60}  // <-- réduit depuis 100 par exemple
            innerRadius={30}  // <-- si tu veux un donut
            fill="#8884d8"
            label={(entry) => `${entry.name}: ${((entry.value / apiData.data.total_contacts) * 100).toFixed(1)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [
              value,
              `Contacts`,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenderPieChart;