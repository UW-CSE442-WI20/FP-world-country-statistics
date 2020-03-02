import Map from "./map.js";
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
            indicatorObject[i] = row["" + i];
        }
        countryObject[indicator] = indicatorObject;
        countryToData[country] = countryObject;
    });
    await console.log(countryNames);
    await console.log(indicators);
    await console.log(countryToData);
}



async function init() {
    renderMap();
    setTabs();
    await parseData();
    
}

init();
