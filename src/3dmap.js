const topo = require("./geoworld.json");
const d3 = require("d3");
console.log(topo);

var land = topojson.feature(topo, topo.objects.land)
var countries = topojson.feature(topo, topo.objects.countries)

var current = d3.select('#map3d-header')
var canvas = document.getElementById('globe')

function draw() {
  var curHeight = window.innerHeight - 100;
  var curWidth = curHeight;

  var radius = curWidth / 2;

  var ctx = canvas.getContext('2d')
  ctx.canvas.width = curWidth;
  ctx.canvas.height = curHeight;

  var projection = d3.geoOrthographic().scale(radius).translate([curWidth / 2, curHeight / 2]);
  var path = d3.geoPath(projection, ctx);
  console.log(path);

  ctx.linewidth = 1.5;
  ctx.fillStyle = "rgba(176, 246, 245, 0.5)";
  ctx.beginPath(), ctx.arc(radius, radius, radius, 0, 2 * Math.PI), ctx.fill(), ctx.stroke();

  ctx.lineWidth = 0.35;
  ctx.fillStyle = "black";
  console.log(countries);
  ctx.beginPath(), path(countries), ctx.fill(), ctx.stroke();
}

draw();
