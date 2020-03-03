const topo = require("./geoworld.json");
const d3 = require("d3");
console.log(topo);

var land = topojson.feature(topo, topo.objects.land)
var countries = topojson.feature(topo, topo.objects.countries)

var current = d3.select('#map3d-header')

// canvas default properties
var curHeight = window.innerHeight - 100;
var curWidth = curHeight;
var radius = curWidth / 2;
var projection = d3.geoOrthographic().scale(radius).translate([curWidth / 2, curHeight / 2]);
var mapAngle = 0;

function draw() {
  var canvas = document.getElementById('globe')
  var ctx = canvas.getContext('2d')
  ctx.canvas.width = curWidth;
  ctx.canvas.height = curHeight;

  var path = d3.geoPath(projection, ctx);
  ctx.linewidth = 1.5;
  ctx.fillStyle = "rgba(176, 246, 245, 0.5)";
  ctx.beginPath(), ctx.arc(radius, radius, radius, 0, 2 * Math.PI), ctx.fill(), ctx.stroke();

  ctx.lineWidth = 0.35;
  ctx.strokeStyle = "white";
  ctx.fillStyle = "black";
  ctx.beginPath(), path(countries), ctx.fill(), ctx.stroke();
}

/**
// mousedrag events
var m0, o0;
function mousedown() {
  m0 = [d3.event.pageX, d3.event.pageY];
  o0 = proj.rotate();
  d3.event.preventDefault();
}
function mousemove() {
  if (m0) {
    var m1 = [d3.event.pageX, d3.event.pageY]
      , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
    o1[1] = o1[1] > 30  ? 30  :
            o1[1] < -30 ? -30 :
            o1[1];
    proj.rotate(o1);
    sky.rotate(o1);
    refresh();
  }
}
function mouseup() {
  if (m0) {
    mousemove();
    m0 = null;
  }  
*/

function initialize() {
  draw();
  var slider = document.getElementById("mapRange");
  slider.oninput = function() {
    mapAngle = this.value;
    projection.rotate([mapAngle, 0]);
    draw();
  }
}

initialize();

