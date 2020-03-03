async function makeRadarChart(final_data) {
    document.getElementById("radar-container").innerHTML = "<canvas id='radar'></canvas>";
    var ctx = document.getElementById("radar");
    new Chart(ctx, {
    type: 'radar',
    data: {
      labels: final_data.labels,
      datasets: final_data.datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
        position: "bottom"
      },
      tooltips: {
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        callbacks: {
          label: function(tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': ' + tooltipItem.yLabel;
          }
        }
      },
    }
});
}

export default makeRadarChart;
