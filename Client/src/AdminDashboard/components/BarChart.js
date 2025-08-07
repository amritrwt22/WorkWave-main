import Chart from "react-apexcharts";

const SalesBarChart = () => {
  const chartoptions = {
    series: [
      {
        data: [0, 31, 40, 28, 51, 42, 109, 100],
      },
      {
        data: [0, 11, 32, 45, 32, 34, 52, 41],
      },
    ],
    options: {
      chart: {
        type: "bar",
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        strokeDashArray: 3,
      },
      stroke: {
        width: 1,
      },
      xaxis: {
        categories: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug"],
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 ">
      <h5 className="text-xl font-semibold">Sales Summary</h5>
      <h6 className="text-gray-600 mb-4">Yearly Sales Report</h6>
      <Chart
        type="bar"
        width="100%"
        height="390"
        options={chartoptions.options}
        series={chartoptions.series}
      />
    </div>
  );
};

export default SalesBarChart;
