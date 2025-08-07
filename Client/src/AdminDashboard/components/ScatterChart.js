import Chart from "react-apexcharts";

const SalesScatterChart = () => {
  const chartoptions = {
    series: [
      {
        // name: "Product A",
        data: [
          [16, 29], [20, 45], [30, 56], [40, 70], [60, 91], [70, 120], [80, 150], [90, 200],
        ],
      },
      {
        // name: "Product B",
        data: [
          [18, 22], [24, 30], [33, 44], [41, 60], [55, 85], [67, 110], [75, 150], [85, 190],
        ],
      },
    ],
    options: {
      chart: {
        type: "scatter",
      },
      xaxis: {
        title: {
          text: "Sales Time",
        },
      },
      yaxis: {
        title: {
          text: "Sales Amount",
        },
      },
      grid: {
        show: true,
      },
      stroke: {
        width: 1,
        colors: ["#FF4560", "#00E396"],
      },
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h5 className="text-xl font-semibold">Sales Data Distribution</h5>
      <h6 className="text-gray-600 mb-4">Scatter Plot of Sales Over Time</h6>
      <Chart
        type="scatter"
        width="100%"
        height="390"
        options={chartoptions.options}
        series={chartoptions.series}
      />
    </div>
  );
};

export default SalesScatterChart;
