import makeDonut from "./pie-chart.js";
import makeLineChart from "./line-chart.js";
import makeBarChart from "./bar-chart.js";
import makeRadarChart from "./radar-chart.js";
import map from "./map.js";
const d3 = require("d3");
const regeneratorRuntime = require("regenerator-runtime");

var indicators = new Set();
var countryNames = new Set();
var countryToData = {};

var data = require("./data.csv");
function renderMap(){
    map(countryToData);
}

function setTabs(){
    document.getElementById("chart-tab").addEventListener("click", function (){
        document.getElementById("graphs").className += " active show";
        document.getElementById("world").classList.remove("show");
        document.getElementById("world").classList.remove("active");
        document.getElementById("tables").classList.remove("show");
        document.getElementById("tables").classList.remove("active");
        document.getElementById("home").classList.remove("show");
    });
    document.getElementById("world-tab").addEventListener("click", function (){
        document.getElementById("world").className += " active show";
        document.getElementById("graphs").classList.remove("show");
        document.getElementById("tables").classList.remove("show");
        document.getElementById("graphs").classList.remove("active");
        document.getElementById("tables").classList.remove("active");
        document.getElementById("home").classList.remove("active");
        document.getElementById("home").classList.remove("show");
    });
    document.getElementById("table-tab").addEventListener("click", function (){
        document.getElementById("tables").className += " active show";
        document.getElementById("world").classList.remove("show");
        document.getElementById("graphs").classList.remove("show");
        document.getElementById("world").classList.remove("active");
        document.getElementById("graphs").classList.remove("active");
        document.getElementById("home").classList.remove("show");
    });
}

async function parseData() {
    await d3.csv(data, async function(row) {

        let country = row["Country Name"];
        let indicator = row["Indicator Name"];
        countryNames.add(country);
        indicators.add(indicator);
        let countryObject = {};
        if (countryToData[country] !== undefined) {
            countryObject = countryToData[country];
        }
        let indicatorObject = {};
        for(let i = 1990; i <= 2015; i++){
            indicatorObject["" + i] = row["" + i];
        }
        countryObject[indicator] = indicatorObject;
        countryToData[country] = countryObject;
    })

}

async function fillFilters(){
    let countryFilter = document.getElementById("country-picker");
    let dataFilter = document.getElementById("data-picker");
    let yearFilter = document.getElementById("year-picker");

    countryNames.forEach((value) => {
        countryFilter.innerHTML += "<option value='" + value + "'>" + value + "</option>";
    });
    indicators.forEach((value) => {
        dataFilter.innerHTML += "<option value='" + value + "'>" + value + "</option>";
    });
    for(let i = 1990; i <= 2015; i++){
        yearFilter.innerHTML += "<option value='" + i + "'>" + i + "</option>";
    }
}

async function generateCharts(){
    let pieChartColors = ['#4e73df', '#f6c23e', '#36b9cc', '#1cc88a', '#6f42c1', '#5a5c69'];
    let secondaryChartColors = ['rgba(78, 115, 223, 0.2)', 'rgba(246, 194, 62, 0.2)', 'rgba(54, 185, 204, 0.2)', 'rgba(28, 200, 138, 0.2)', 'rgba(111, 66, 193, 0.2)', 'rgba(90, 92, 105, 0.2)'];
    let countryFilter = $("#country-picker").val();
    let dataFilter = $("#data-picker").val();
    let yearFilter = $("#year-picker").val();
    let donutData = [];

    let barData = {};
    let barLabel = getRangeYears(parseInt(yearFilter));
    barData.labels = barLabel;
    let barDataSet = [];
    let lineDataSet = [];
    let  lineData = {};
    lineData.labels = barLabel;
    let radarDataSet = [];
    let  radarData = {};
    radarData.labels = countryFilter;
    for(let i = 0; i < countryFilter.length; i++){
        donutData.push({color: pieChartColors[i], name: countryFilter[i], value: countryToData[countryFilter[i]][dataFilter][yearFilter]});
        let barTemp = getCountryData(countryFilter[i], dataFilter, barLabel);

        barDataSet.push({label: countryFilter[i], backgroundColor: pieChartColors[i], data: barTemp});

        let lineTemp = getCountryData(countryFilter[i], dataFilter, barLabel);
        lineDataSet.push({label: countryFilter[i], backgroundColor:secondaryChartColors[i] ,borderColor: pieChartColors[i], data: lineTemp, lineTension: 0.3, pointRadius: 3,
            pointBorderWidth: 2});


    }

    for(let i = 0; i < barLabel.length; i++){
        let year = barLabel[i];
        let tempRadar = {label: year, backgroundColor:secondaryChartColors[i] ,
            borderColor: pieChartColors[i],
            fill: true};
        let data =[];
        for(let j = 0; j < lineDataSet.length; j++){
            data.push(lineDataSet[j].data[i]);
        }
        tempRadar.data = data;
        radarDataSet.push(tempRadar);
    }
    barData.datasets = barDataSet;
    lineData.datasets = lineDataSet;
    radarData.datasets = radarDataSet;
    makeDonut(donutData);
    makeBarChart(barData);
    makeLineChart(lineData);
    makeRadarChart(radarData);

}

function getRangeYears(year){
    if(year <= 1995){
        return [1990, 1991, 1992, 1993, 1994, 1995];
    }else if(year >= 2010){
        return [2010, 2011, 2012, 2013, 2014, 2015];
    }else{
        return [year, year + 1, year + 2, year + 3, year  + 4, year + 5];
    }
}

function getCountryData(country, dataType, years){
    let ret = [];
    for(let i = 0 ; i < years.length; i++){
        ret.push(countryToData[country][dataType][years[i]]);
    }
    return ret;
}

async function enableGenerateButton(){
    console.log("here");
    let countryFilter = $("#country-picker").val();
    let dataFilter = $("#data-picker").val();
    let yearFilter = $("#year-picker").val();

    if(countryFilter.length === 0 || dataFilter === "" || yearFilter === ""){
        document.getElementById("generate_button").classList.remove("active");
        document.getElementById("generate_button").className += " disabled";
        document.getElementById("generate_button").disabled = true;
    }else{
        document.getElementById("generate_button").classList.remove("disabled");
        document.getElementById("generate_button").className += " active";
        document.getElementById("generate_button").disabled = false;
    }
}

async function initCharts(){
    $("#country-picker").val(["Argentina", "Chile", "Hong Kong SAR, China"]);
    $("#data-picker").val("Population, total");
    $("#year-picker").val("2000");
    $('.selectpicker').selectpicker('refresh');
    generateCharts();
}

async function init() {
    document.getElementById("generate_button").addEventListener("click", generateCharts);
    document.getElementById("country-picker").addEventListener("change", enableGenerateButton);
    document.getElementById("data-picker").addEventListener("change", enableGenerateButton);
    document.getElementById("year-picker").addEventListener("change", enableGenerateButton);

    setTabs();
    await parseData();
    renderMap();
    await fillFilters();
    await initCharts();
}

init();
