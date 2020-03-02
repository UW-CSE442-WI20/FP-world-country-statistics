import Map from "./map.js";
import makeDonut from "./pie-chart.js";
const d3 = require("d3");
const regeneratorRuntime = require("regenerator-runtime");

var indicators = new Set();
var countryNames = new Set();
var countryToData = {};

var data = require("./data.csv");
function renderMap(){
    var map = new Map();
    map.render("United States of America", "navy");
    map.render("China", "steelblue");
}

function setTabs(){
    document.getElementById("chart-tab").addEventListener("click", function (){
        document.getElementById("graphs").className += " active show";
        document.getElementById("world").classList.remove("show");
        document.getElementById("world").classList.remove("active");
        document.getElementById("tables").classList.remove("show");
        document.getElementById("tables").classList.remove("active");
        document.getElementById("3d-world").classList.remove("active");
        document.getElementById("3d-world").classList.remove("show");

    });
    document.getElementById("3d-world-tab").addEventListener("click", function (){
        document.getElementById("3d-world").className += " active show";
        document.getElementById("graphs").classList.remove("show");
        document.getElementById("graphs").classList.remove("active");
        document.getElementById("tables").classList.remove("show");
        document.getElementById("tables").classList.remove("active");
        document.getElementById("world").classList.remove("show");
        document.getElementById("world").classList.remove("active");
    });
    document.getElementById("world-tab").addEventListener("click", function (){
        document.getElementById("world").className += " active show";
        document.getElementById("graphs").classList.remove("show");
        document.getElementById("tables").classList.remove("show");
        document.getElementById("graphs").classList.remove("active");
        document.getElementById("tables").classList.remove("active");
        document.getElementById("3d-world").classList.remove("active");
        document.getElementById("3d-world").classList.remove("show");
    });
    document.getElementById("table-tab").addEventListener("click", function (){
        document.getElementById("tables").className += " active show";
        document.getElementById("world").classList.remove("show");
        document.getElementById("graphs").classList.remove("show");
        document.getElementById("world").classList.remove("active");
        document.getElementById("graphs").classList.remove("active");
        document.getElementById("3d-world").classList.remove("active");
        document.getElementById("3d-world").classList.remove("show");
    });
}

function setSelectPickers(){
    $('#country-picker').selectpicker();
    $('#data-picker').selectpicker();
    $('#year-picker').selectpicker();
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
    let countryFilter = $("#country-picker").val();
    let dataFilter = $("#data-picker").val();
    let yearFilter = $("#year-picker").val();
    let donutData = [];
    
    for(let i = 0; i < countryFilter.length; i++){
        donutData.push({color: pieChartColors[i], name: countryFilter[i], value: countryToData[countryFilter[i]][dataFilter][yearFilter]});
    }
    makeDonut(donutData);
}

async function enableGenerateButton(){
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

async function init() {
    document.getElementById("generate_button").addEventListener("click", generateCharts);
    document.getElementById("country-picker").addEventListener("change", enableGenerateButton);
    document.getElementById("data-picker").addEventListener("change", enableGenerateButton);
    document.getElementById("year-picker").addEventListener("change", enableGenerateButton);
    renderMap();
    setTabs();
    await parseData();
    await fillFilters();
}

init();
