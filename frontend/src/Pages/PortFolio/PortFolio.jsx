import React, { useState } from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartTooltip,
} from "@progress/kendo-react-charts";

import { useGetPortfolioDataQuery } from "../../redux/Slice/Portfolio.Slice";
import "@progress/kendo-theme-default/dist/all.css";

const tenureOptions = [
  { label: "Daily", color: "#3B82F6" },       // Blue
  { label: "Weekly", color: "#22C55E" },      // Green
  { label: "Monthly", color: "#F59E0B" },     // Amber
  { label: "Quarterly", color: "#EC4899" },   // Pink
  { label: "Yearly", color: "#8B5CF6" },      // Purple
];

const PortFolio = ({ visible, onClose }) => {
  const [tenure, setTenure] = useState("Daily");

  const selected = tenureOptions.find((t) => t.label === tenure);
  const currentColor = selected?.color || "#3B82F6";

  const { data, isLoading, error } = useGetPortfolioDataQuery(tenure);
  const categories = data?.data?.map((d) => d.date) || [];
  const values = data?.data?.map((d) => d.value) || [];

  return (
    visible && (
      <Dialog title="📊 Portfolio Chart" onClose={onClose}>
        {/* Button group */}
        <div className="mb-4 flex flex-wrap gap-2">
          {tenureOptions.map((t) => (
            <button
              key={t.label}
              onClick={() => setTenure(t.label)}
              className={`px-4 py-1.5 rounded-full font-medium text-white transition-all duration-200 ${
                t.label === tenure
                  ? ""
                  : "hover:opacity-90"
              }`}
              style={{
                backgroundColor: t.label === tenure ? t.color : "#CBD5E1", // Slate-300 for inactive
                color: t.label === tenure ? "white" : "#1E293B", // Slate-800 for inactive
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Feedback states */}
        {isLoading && <p className="text-gray-500">Loading chart...</p>}
        {error && <p className="text-red-500">Failed to load data.</p>}

        {/* Chart */}
        {data && (
          <Chart>
            <ChartCategoryAxis>
              <ChartCategoryAxisItem categories={categories} />
            </ChartCategoryAxis>
            <ChartSeries>
              <ChartSeriesItem
                type="column"
                data={values}
                color={currentColor}
              />
            </ChartSeries>
            <ChartTooltip
              render={(props) => {
                const point = props.point;
                return (
                  <div className="p-2 text-sm">
                    <strong>Date:</strong> {point.category}
                    <br />
                    <strong>Value:</strong> {point.value}
                  </div>
                );
              }}
            />
          </Chart>
        )}
      </Dialog>
    )
  );
};

export default PortFolio;
