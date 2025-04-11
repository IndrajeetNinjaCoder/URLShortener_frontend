import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClicks } from "../redux/clickSlice"; // Adjust path if needed
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#4ade80",
  "#60a5fa",
  "#facc15",
  "#f87171",
  "#a78bfa",
  "#34d399",
];

export const Chart = () => {
  const dispatch = useDispatch();
  const { data: clicks, loading, error } = useSelector((state) => state.clicks);

  useEffect(() => {
    dispatch(fetchClicks());
  }, [dispatch]);

  const { deviceData, browserData, clicksOverTime } = useMemo(() => {
    const devices = new Map();
    const browsers = new Map();
    const timeClicksMap = new Map();
  
    clicks.forEach((click) => {
      const deviceType = click.deviceType;
      const browserType = click.browser;
      const date = new Date(click.timestamp).toLocaleDateString();
  
      devices.set(deviceType, (devices.get(deviceType) || 0) + 1);
      browsers.set(browserType, (browsers.get(browserType) || 0) + 1);
      timeClicksMap.set(date, (timeClicksMap.get(date) || 0) + 1);
    });
  
    return {
      deviceData: Array.from(devices.entries()).map(([name, value]) => ({
        name,
        value,
      })),
      browserData: Array.from(browsers.entries()).map(([name, value]) => ({
        name,
        value,
      })),
      clicksOverTime: Array.from(timeClicksMap.entries())
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)), // ✅ sort here
    };
  }, [clicks]);
  

  if (loading) return <p className="text-center">Loading charts...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 bg-white shadow-2xl rounded-2xl border border-gray-200 my-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Analytics Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left - Line Chart */}
        <div>
          <h3 className="text-md font-medium mb-4 text-center">
            Clicks Over Time
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={clicksOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Right - Pie Charts (stacked) */}
        <div className="flex flex-row items-center gap-6">
          {/* Devices */}
          <div>
            <h3 className="text-md font-medium mb-2 text-center">Devices</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={deviceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {deviceData.map((entry, index) => (
                  <Cell
                    key={`device-cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          {/* Browsers */}
          <div>
            <h3 className="text-md font-medium mb-2 text-center">Browsers</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={browserData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {browserData.map((entry, index) => (
                  <Cell
                    key={`browser-cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};
