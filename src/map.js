const topo = require("./geoworld.json");
const d3 = require("d3");
const cc = require("./countrycodes.js");
const newcc = require("./cc.json");
var active = d3.select(null);

var width, height, zoom, drag, path, g, data, currentView, proj;
var svg, legend;
var currFilter, currYear;
var currcountry;
var focused = false;

// with default view = "2d"
function map(d, view = "2d"){
  // set dimensions and class values
  data = d;
  let dim = d3.select("#map").node().getBoundingClientRect();
  width = dim.width * 0.95;
  height = width * 0.6;
  currFilter = $("#map-filter-selector").val(),
  currYear = $("#map-year-selector").val();
  legend = d3.select("#map-legend").append("div").attr("width", width/2 + "px").attr("class", "legend");

  // render
  render(view);

  // initialize click functoins for buttons
  d3.select("#view-selector").selectAll("label").on("click", updateView);
  d3.select("#map-year-selector").on("change", function() {
    currYear = $("#map-year-selector").val();
    console.log($("#map-year-selector").val());
    clearData();
    // if (currcountry != "") {
    //   console.log($("country"));
    // displayData();
    // }
    fill(true);
  });
  d3.select("#map-filter-selector").on("change", function() {
    currFilter = $("#map-filter-selector").val();
    fill(true);
  });

}

function updateView() {
  if (this.id !== currentView) {
    svg.remove();
    render(this.id);
  }
}

function render(view) {
  proj =
  view === "2d" ? d3
    .geoNaturalEarth1()
    .scale(width / 5.5)
    .translate([width / 2, height / 2]) :
   d3.geoOrthographic().scale(width/4).translate([width/ 2, height/2]);


   // drag sensitivity constant
   // initial map scale
   const initSense = 75;
   const initScale = proj.scale();

   currentView=view;

   clearData();
    path = d3.geoPath().projection(proj);

    svg = d3.select("#map")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .on("click", stopped)

    svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .on("click",reset);

    g = svg.append("g");

    g
      .selectAll("path")
      .data(topojson.feature(topo, topo.objects.countries).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "feature")
      .on("click", focus);

  // zoom = d3.zoom().scaleExtent([1,6]).on("zoom", zoomed);
  //svg.call(zoom);
  //svg.call(d3.zoom().scaleExtent([1,6]).on("zoom", zoomed));

  // drag call
  svg.call(d3.drag().on('drag', function() {
    if (view != "2d" && !focused) {
      const rotate = proj.rotate()
      const k = initSense / proj.scale()

      proj.rotate([
        rotate[0] + d3.event.dx * k,
        0
      ])
      path = d3.geoPath().projection(proj)
      svg.selectAll("path").attr("d", path)
    }
  }))

  // ordinary zoom call


  // For focus zoom call
  zoom = d3.zoom().scaleExtent([1,6]).on("zoom", zoomed);

  /**
  svg.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)); */
  fill(false);
}

function fill(notInit) {
  var filteredData = {};
  var colorScale;
  // find non empty data values
  Object.keys(data).forEach(country => {
    let value = data[country][currFilter];
    if (value !== undefined && value[currYear] !== "" && country !== "World") {
      console.log("match")
      filteredData[country] = Number(value[currYear]);
    }
  });

  // if valid data exists, make legend and continue
  let dataCount = Object.keys(filteredData).length;
  if (dataCount > 0) {
    d3.select("#map-info").html("Data available for " + dataCount + " countries.");
    d3.select("#map-title").html(currFilter + " in " + currYear);

    let domain = Object.values(filteredData);
    let maxValue = d3.extent(domain)[1];
    for (let i = 0; i < 8; i++) {
      if (maxValue <= Math.pow(10, i)) {
        if (Math.pow(10, i) > 100) {
           maxValue = Math.round(maxValue / 10) * 10;
        } else {
          maxValue = Math.pow(10, i);
        }
        //maxValue = Math.pow(10, i);
        break;
      }
    }
    colorScale = d3.scaleQuantize()
                      .domain([0, maxValue])
                      .range(d3.schemeYlGnBu[Math.min(5, domain.length)]);
    legend.html(generateLegend(domain, colorScale));
    if (notInit) {
          legend.html(generateLegend(domain, colorScale));
    }
    d3.selectAll("path").style("fill", function(d) {
      let country = d.properties.name;
      if (filteredData[country] !== undefined) {
        let color = colorScale(filteredData[country]);
        return color;
      }
    });
  } else {
    // else erase legend and titles
      d3.select("#map-info").html("Data is unavailable for selected year and statistic.");
      d3.select("#map-title").html("");
      legend.html("");
  }

  d3.selectAll("path").style("fill", function(d) {
    let country = d.properties.name;
    if (filteredData[country] !== undefined) {
      let color = colorScale(filteredData[country]);
      return color;
    }
  })

}

function polishNum(num) {
  if (num > 100000) {
    return Math.round((num / 100000 / 100 * 100)) + "m";
  } else if (num > 1000) {
    return Math.round(num / 1000 * 100) / 100 + "k";
  } else {
    return Math.round((num / 10) * 10);
  }
}

function generateLegend(data, scale) {
  // find buckets from color scale
  console.log("generating")
  let rangeToColor = {};
  data.forEach(d => {
    let r = scale.invertExtent(scale(d));
    rangeToColor[r] = scale(d) }
  );

  // sort buckets
  let options = Object.keys(rangeToColor).sort((a,b) => {
    let res = Number(a.split(",")[0]) < Number(b.split(",")[0]);
    return res ? -1 : 1;
  });

  // construct legend
  let s = "<div class='legend-items'>";
  options.forEach(d => {
    let r = d.split(",");
    s+= "<div class='legend-item'><div class='legend-color' style='background-color:" + rangeToColor[d] + ";'></div>" +
    "<div><center>" + polishNum(r[0]) + "-" + polishNum(r[1]) + "</center></div></div>";
  })
  s+= "</div>";
  return s;
}

function focus(node){
  focused = true;

  // Rotate on center
  if (currentView != "2d") {
    var center = d3.geoCentroid(node);
    var rotate = proj.rotate();
    proj.rotate([-center[0], 0]);
    path = d3.geoPath().projection(proj)
    svg.selectAll("path").attr("d", path);
    /*
    svg.transition()
     .duration(750)
     .tween("rotateThis", function() {
       console.log("here");
       var center = d3.geoCentroid(node);
       var r = d3.interpolate(proj.rotate()[0], -center[0]);
       return function (t) {
         proj.rotate([r(t), 0]);
         path = d3.geoPath().projection(proj)
         svg.selectAll("path").attr("d", path);
       }
    });*/
  }


  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(node),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  svg.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  // currcountry = node.properties.name;
  displayData(node.properties.name);
}

function clearData() {
  d3.select("#map-data").style("padding-top", "1.25rem").html("<h4>Select a country to get individual stats.</h4");
}

function reset() {
  focused = false;

  active.classed("active", false);
  active = d3.select(null);
  currcountry = "";

  svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
  clearData();
}

function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  g.attr("transform", d3.event.transform);
}

function displayData(country) {
  // Fixed inconsistency
  var countryCode;
  if (country == "Russia") {
    country = "Russian Federation";
    countryCode = cc.codes[country];
  } else if (country == "Democratic Republic of Congo") {
    country = "Congo, Dem. Rep.";
    countryCode = cc.codes["Congo, Democratic Republic of the"];
  } else if (country == "Central African Rep.") {
    country = "Central African Republic";
    countryCode = cc.codes["Central African Republic"]
  } else if (country == "Congo") {
    country = "Congo, Rep.";
    countryCode = cc.codes["Congo"];
  } else if (country == "North Korea") {
      country = "Korea, Dem. Rep.";
      countryCode = cc.codes["Korea: Democratic People\'S Republic of"];
  } else if (country == "South Korea") {
    country = "Korea, Rep.";
    countryCode = cc.codes["Korea: Republic of"];
  } else if (country == "Dominican Rep.") {
    country = "Dominican Republic";
    countryCode = cc.codes["Dominican Republic"];
  } else if (country == "Palestine") {
    countryCode = "PS";
  } else if (country == "Taiwan") {
    countryCode = "TW";
  } else if (country == "Syria") {
    country = "Syrian Arab Republic";
    countryCode = cc.codes["Syrian Arab Republic"];
  } else if (country == "N. Cyprus") {
    country = "Cyprus";
    countryCode = cc.codes["Cyprus"];
  } else if (country == "Iran") {
    country = "Iran, Islamic Rep.";
    countryCode = cc.codes["Iran: Islamic Republic Of"];
  } else if (country == "S. Sudan") {
    country = "South Sudan";
    countryCode = "SS";
  } else if (country == "Laos") {
    country = "Lao PDR";
    countryCode = "LA";
  } else if (country == "eSwatini") {
    country = "Eswatini";
    countryCode = "SZ";
  } else if (country == "Kyrgyzstan") {
    country = "Kyrgyz Republic";
  } else if (country == "Côte d'Ivoire") {
    country = "Cote d'Ivoire";
    countryCode = cc.codes["Cote D\'Ivoire"];
  } else if (country == "W. Sahara") {
    country = "Western Sahara";
    countryCode = cc.codes["Western Sahara"];
  } else if (country == "Libya") {
    countryCode = "LY";
  } else if (country == "Egypt") {
    country = "Egypt, Arab Rep.";
    countryCode = cc.codes["Egypt"]
  } else if (country == "Moldova") {
    countryCode = cc.codes["Moldova: Republic of"];
  } else if (country == "Tanzania") {
    countryCode = cc.codes["Tanzania, United Republic of"];
  } else {
    countryCode = cc.codes[country];
  }

  let stats = data[country];
  let unknown = "<br>Unknown stats:<br>";
  let html = "<div class='map-data-header'><h3 style='margin-top:16px'>" + country + "</h3><img src='https://www.countryflags.io/" + countryCode + "/flat/64.png' padding=0px></div>";
  if (stats) {
    Object.keys(stats).forEach(key => {
      if (stats[key] && stats[key][currYear]) {
        html += "<b>" + key + " : </b>" + stats[key][currYear] + "<br><br/>";
      } else {
        unknown += "<t>" + key + "<br>";
      }
    });
  } else {
    html += "Data is currently missing or unavailable for this country.";
  }
  html+= unknown;

  d3.select("#map-data").style("padding-top", "0px").html(html);
  }

function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

export default map;
