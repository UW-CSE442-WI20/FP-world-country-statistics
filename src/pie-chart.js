async function makeDonut(final_data) {
    document.getElementById("pie-container").innerHTML = "<canvas id='pie'></canvas>";
    var ctx = document.getElementById("pie");
    console.log("final_data" + final_data)
    let label_data = final_data.map(x => x.name);
    console.log(label_data)
    let value_data = final_data.map(x => x.value);
    console.log(value_data)
    let color_data = final_data.map(x => x.color);
    var value_filtered = value_data.filter(v=>v!='');
    console.log(value_filtered)



function filter_values(arr) {
  arr.filter(function (el) {
    return el != "";
  });
}
var myPieChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: label_data,
    datasets: [{
      data: value_filtered,
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
console.log(myPieChart.data.labels)
    
}



export default makeDonut;
