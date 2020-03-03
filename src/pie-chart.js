const d3 = require("d3");

async function makeDonut(final_data) {
    document.getElementById("pie-container").innerHTML = "<canvas id='pie'></canvas>";
    var ctx = document.getElementById("pie");
    let label_data = final_data.map(x => x.name);
    let value_data = final_data.map(x => x.value);
    let color_data = final_data.map(x => x.color);

    
var myPieChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: label_data,
    datasets: [{
      data: value_data,
      backgroundColor: color_data,
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
    },
    legend: {
      display: true,
      position: "bottom"
    },
    cutoutPercentage: 80,
  },
});
    
}



export default makeDonut;
