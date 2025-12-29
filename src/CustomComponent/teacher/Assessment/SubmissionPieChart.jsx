import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SubmissionPieChart = ({ data }) => {
  // Data format for Recharts
  const chartData = [
    { name: 'Submitted', value: data.submittedCount },
    { name: 'Not Submitted', value: data.notSubmittedCount },
  ];

  const COLORS = ['#22c55e', '#ef4444']; // Green and Red

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-full md:w-[350px]">
      <h3 className="text-sm font-semibold text-gray-600 mb-4">Submission Status</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-center text-xs text-muted-foreground">
        Completion: {data.completionRate}%
      </div>
    </div>
  );
};

export default SubmissionPieChart;