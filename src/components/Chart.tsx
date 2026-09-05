
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement, 
  LineElement,   
  BarElement,   
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import type { ChartResponse } from "../types/Types";
import Loading  from "./Loading";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export function Chart({chartData}: ChartResponse) {



  const ChartData = useMemo(
    () => ({
      labels: chartData.map((item) => item.period),
      datasets: [
        {
          label: "appointments",
          data: chartData.map((item) => item.appointments),
          backgroundColor: "rgba(59, 130, 246, 0.6)", 
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: "medicalRecord",
          data: chartData.map((item) => item.medicalRecords),
          backgroundColor: "rgba(59, 130, 246, 0.6)", 
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: "patients",
          data: chartData.map((item) => item.patients),
          backgroundColor: "rgba(59, 130, 246, 0.6)", 
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: "transactions",
          data: chartData.map((item) => item.transactions),
          backgroundColor: "rgba(59, 130, 246, 0.6)", 
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: "invoices",
          data: chartData.map((item) => item.invoices),
          backgroundColor: "rgba(59, 130, 246, 0.6)", 
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: "balance",
          data: chartData.map((item) => item.balance),
          backgroundColor: "rgba(59, 130, 246, 0.6)", 
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: "revenue",
          data: chartData.map((item) => item.revenue),
          backgroundColor: "rgba(59, 130, 246, 0.6)", 
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    }),
    [chartData]
  );
if(chartData.length === 0) return <Loading />;
  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  return (
    <div style={{ height: "350px", width: "100%" }}>
      <Bar data={ChartData} options={options}  />
    </div>
  );
}