import React from "react";
import { Chart } from "react-google-charts";

const Chart = (chartName, data) => {
    data = [
    ["Year", "Sales"],
    ["2004", 1],
    ["2005", 44],
    ["2006", 68],
    ["2007",50],
  ];
  const options = {
    title: `${chartName}`,
    curveType: "function",
    legend: { position: "bottom" },
  };
  
 
  return (
    <div>Chart
 <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
    </div>
  )
}

export default Chart