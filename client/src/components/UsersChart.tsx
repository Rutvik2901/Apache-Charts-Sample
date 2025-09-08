import { Empty, Skeleton } from "antd";
import * as echarts from "echarts";
import React, { useEffect, useRef, useState } from "react";
import { fetchStatsByYear, fetchYears } from "../api";
import { StatsResponse } from "../models/Api";
import YearSelector from "./YearSelector";

const UserStatsChart: React.FC = () => {
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cache, setCache] = useState<Record<number, StatsResponse>>({});
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  useEffect(() => {
    fetchYears()
      .then((data) => {
        const yearsApi = data.years;
        setYears(yearsApi);
        if (yearsApi.length > 0) {
          setSelectedYear(Math.max(...yearsApi));
        }
      })
      .catch(() => setErr("Failed to fetch years"));
  }, []);

  // Fetch stats when year changes
  useEffect(() => {
    if (!selectedYear) return;
    console.log("here");


    const fetchData = async () => {
      if (cache[selectedYear]) {
        renderChart(cache[selectedYear]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetchStatsByYear(selectedYear);
        setCache((prev) => ({ ...prev, [selectedYear]: res }));
        renderChart(res);
      } catch (error) {
        setErr("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  // Render chart
  const renderChart = (data: StatsResponse) => {
    if (!chartInstance.current) return;

    if (!data.monthlyCounts || data.monthlyCounts.every((c) => c === 0)) {
      chartInstance.current.clear();
      return;
    }

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    chartInstance.current.setOption({
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: months },
      yAxis: { type: "value" },
      series: [
        {
          data: data.monthlyCounts,
          type: "bar",
          itemStyle: { color: "#1890ff" },
        },
      ],
    });
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <YearSelector value={selectedYear ?? undefined} years={years} onChange={(value) => {
          setSelectedYear(value);
        }} />
      </div>

      <div style={{ width: "100%", height: 400, position: "relative" }}>
        {/* Chart container always mounted */}
        <div ref={chartRef} style={{ width: "100%", height: "100%" }} />

        {err && <div className="text-red-600 mb-3">{err}</div>}

        {/* Overlay states */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        )}
        {!loading &&
          selectedYear &&
          cache[selectedYear] &&
          cache[selectedYear].monthlyCounts.every((c) => c === 0) && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Empty description="No data available for this year" />
            </div>
          )}
      </div>
    </div>
  );
};

export default UserStatsChart;
