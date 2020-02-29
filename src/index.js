import Map from "./map.js";

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
    });
    
    document.getElementById("world-tab").addEventListener("click", function (){
        document.getElementById("world").className += " active show";
        document.getElementById("graphs").classList.remove("show");
        document.getElementById("tables").classList.remove("show");
        document.getElementById("graphs").classList.remove("active");
        document.getElementById("tables").classList.remove("active");
    });
    document.getElementById("table-tab").addEventListener("click", function (){
        document.getElementById("tables").className += " active show";
        document.getElementById("world").classList.remove("show");
        document.getElementById("graphs").classList.remove("show");
        document.getElementById("world").classList.remove("active");
        document.getElementById("graphs").classList.remove("active");
    });
}

function setSelectPickers(){
    $('#country-picker').selectpicker();
    $('#data-picker').selectpicker();
    $('#year-picker').selectpicker();
}



function init() {
    renderMap();
    setTabs();
    // setSelectPickers();
   
    
}

init();