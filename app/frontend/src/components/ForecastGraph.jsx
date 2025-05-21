import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useTheme } from "../ThemeContext";
import './ForecastGraph.css';
import InfoTooltip from './InfoTooltip';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ForecastGraph({ data, costPerKw }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  var displayData_unused = null; 
  const [displayData, setDisplayData] = useState(null);
  const { theme } = useTheme();
  let cost = costPerKw || 0.25; 

  useEffect(() => {
    if (!displayData) {
      var initialData = [];
      for(let i = 0; i < 30; i++) {
        initialData.push({
          total_power: 5,
          localminute: `Day ${i + 1}`
        });
      }
      setDisplayData(initialData);
    }

    if (data && data.length > 0) {
      setDisplayData(data);
    }
  }, [data]);

  if (!displayData) return null;

  const labels = displayData.map(item => item.localminute);
  
  const powerValues = displayData.map(item => item.total_power);
  const spendingValues = displayData.map(item => item.total_power * cost);

  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = theme === 'dark' ? '#f1f5f9' : '#1a202c';

  const chartData = {
    labels,
    datasets: [
      {
        label: "Daily Power Usage (kW)",
        data: powerValues,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 8,
        yAxisID: 'y',
        pointBackgroundColor: (context) => {
          const index = context.dataIndex;
          return hoveredPoint === index ? 'rgb(255, 99, 132)' : 'rgb(75, 192, 192)';
        },
      },
      {
        label: "Daily Spending (£)",
        data: spendingValues,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 8,
        yAxisID: 'y1',
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.dataset.label.includes("Power")) {
              return `Usage: ${context.parsed.y.toFixed(2)} kW`;
            } else {
              return `Spending: £${context.parsed.y.toFixed(2)}`;
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        type: 'linear',
        position: 'left',
        grid: {
          color: gridColor
        },
        ticks: {
          color: textColor
        },
        title: {
          display: true,
          text: 'Power Usage (kW)',
          color: textColor
        }
      },
      y1: {
        beginAtZero: true,
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false,
          color: gridColor
        },
        ticks: {
          color: textColor
        },
        title: {
          display: true,
          text: 'Spending (£)',
          color: textColor
        }
      },
      x: {
        grid: {
          color: gridColor
        },
        ticks: {
          color: textColor
        },
        title: {
          display: true,
          text: 'Day',
          color: textColor
        }
      }
    },
    onHover: (event, elements) => {
      if (elements && elements.length > 0) {
        setHoveredPoint(elements[0].index);
      } else {
        setHoveredPoint(null);
      }
    }
  };

  let total = 0;
  for(let i = 0; i < spendingValues.length; i++) {
    total += spendingValues[i];
  }
  const totalMonthlySpending = total.toFixed(2);

  return (
    <div className={`forecast-graph-container ${theme}`}>
      <div className="forecast-header">
        <div className="forecast-title">Monthly Energy Forecast</div>
        <InfoTooltip text="This graph shows your predicted energy usage for the next 30 days. The blue line shows how much electricity you're likely to use each day (in kilowatts), while the red line shows what this will cost you in pounds. Hover over any point to see exact values. Your total monthly spending is shown below the graph, based on your current energy rate." />
      </div>
      <div className="cost-info">
        <p>Cost per kW: £{cost.toFixed(2)}</p>
        <p>Total Monthly Spending: £{totalMonthlySpending}</p>
      </div>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
