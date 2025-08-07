import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";

const SalesChart = () => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: "bar",
        height: 400,
        toolbar: {
          show: false, // Hide the toolbar for a cleaner UI
        },
        animations: {
          enabled: true, // Smooth animations
          easing: "easeinout",
          speed: 800, // Animation speed
        },
      },
      xaxis: {
        categories: [],
        title: {
          text: "Dates",
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
          },
        },
        axisBorder: {
          show: true,
          color: "#ccc", // Border color for x-axis
        },
        axisTicks: {
          show: true,
          color: "#ccc", // Tick color for x-axis
        },
      },
      yaxis: {
        title: {
          text: "Earnings (INR)",
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
          },
        },
        labels: {
          formatter: (value) => `₹${value}`, // Formatting y-axis labels as currency
        },
        axisBorder: {
          show: true,
          color: "#ccc", // Border color for y-axis
        },
        axisTicks: {
          show: true,
          color: "#ccc", // Tick color for y-axis
        },
      },
      colors: ["#6B5B95"], // Main color for bars
      grid: {
        borderColor: "#eee", // Lighter grid lines
        strokeDashArray: 5, // Dotted grid lines
      },
      tooltip: {
        y: {
          formatter: (value) => `₹${value}`, // Tooltip formatting for earnings
        },
        theme: "dark", // Dark theme for the tooltip
      },
      plotOptions: {
        bar: {
          borderRadius: 5, // Rounded corners for the bars
          horizontal: false, // Vertical bars
          columnWidth: "60%", // Adjust column width
        },
      },
      fill: {
        type: "gradient", // Gradient fill for bars
        gradient: {
          shade: "dark",
          type: "horizontal", // Horizontal gradient
          shadeIntensity: 0.5,
          gradientToColors: ["#FFB6C1"], // Gradient to a soft pink color
          stops: [0, 100], // Gradient stops
        },
      },
    },
    series: [
      {
        name: "Earnings in INR",
        data: [],
      },
    ],
  });

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/booking/getBookingLast10Days",
          {
            withCredentials: true,
          }
        );
        const earningsData = response.data.data;
        console.log(earningsData);

        const dates = earningsData.map((item) => item.date);
        const earnings = earningsData.map((item) => item.earnings);

        // Update chart data
        setChartData((prevData) => ({
          ...prevData,
          options: {
            ...prevData.options,
            xaxis: { ...prevData.options.xaxis, categories: dates },
          },
          series: [{ name: "Earnings in INR", data: earnings }],
        }));
      } catch (error) {
        console.error("Error fetching earnings data:", error);
      }
    };

    fetchEarningsData();
  }, []);

  return (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-black">
        Earnings Summary
      </h2>
      <p className="mb-6 text-black">Earnings from the last 10 days</p>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={400}
      />
    </div>
  );
};

export default SalesChart;
