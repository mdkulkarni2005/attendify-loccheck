
import React from 'react';
import { 
  BarChart as ReChartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AttendanceChartProps {
  data: {
    name: string;
    present: number;
    absent: number;
  }[];
}

const AttendanceChart = ({ data }: AttendanceChartProps) => {
  return (
    <div className="h-[300px] w-full border rounded-md p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ReChartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="present" fill="#8884d8" name="Present" />
          <Bar dataKey="absent" fill="#82ca9d" name="Absent" />
        </ReChartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
