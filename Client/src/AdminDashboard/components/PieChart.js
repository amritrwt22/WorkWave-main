import Chart from "react-apexcharts";

const SalesPieChart = () => {
  const chartoptions = {
    series: [44, 55, 13, 43],
    options: {
      chart: {
        type: "pie",
      },
      labels: ["Product A", "Product B", "Product C", "Product D"],
      dataLabels: {
        enabled: true,
      },
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h5 className="text-xl font-semibold">Product Distribution</h5>
      <h6 className="text-gray-600 mb-4">Sales Distribution by Product</h6>
      <Chart
        type="pie"
        width="100%"
        height="390"
        options={chartoptions.options}
        series={chartoptions.series}
      />
    </div>
  );
};

export default SalesPieChart;
