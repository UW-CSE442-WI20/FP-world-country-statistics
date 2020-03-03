const topo = require("./geoworld.json");
const d3 = require("d3");
const cc = require("./countrycodes.js");
var active = d3.select(null);
var width, height, zoom, path, svg, g, data;

function map(d){
  data = d;
  let dim = d3.select("#map").node().getBoundingClientRect();
  width = dim.width;
  height = dim.width/2;
  
  zoom = d3.zoom().scaleExtent([1,6]).on("zoom", zoomed);

  path = d3.geoPath().projection(
    d3
      .geoNaturalEarth1()
      .scale(width / 6)
      .translate([width / 2, height / 2])
  );

  svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped)

  svg.append("rect").attr("class", "background").attr("width", width).attr("height", height).on("click",reset);
  g = svg.append("g");

  g
    .selectAll("path")
    .data(topojson.feature(topo, topo.objects.countries).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "feature")
    .on("click", focus);

  svg.call(zoom);
}

function focus(node){
  console.log(node);
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
  
  displayData(node.properties.name);
}
  
function reset() {
  active.classed("active", false);
  active = d3.select(null);
  
  svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
}
function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  g.attr("transform", d3.event.transform);
}

function displayData(country) {
  let stats = data[country];
  console.log(cc.cc);
  let html = "<div class='map-data-header'><div><h1>" + country + "</h1></div><img src='https://www.countryflags.io/" + cc.codes[country] + "/flat/64.png'></div>";
  console.log(stats);
  Object.keys(stats).forEach(key => {
    html += key + " : " + stats[key][2015] + "<br/>";
  });
  d3.select("#map-data").html(html);
  }

function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}


export default map;
