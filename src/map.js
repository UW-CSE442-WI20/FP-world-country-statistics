const topo = require("./geoworld.json");
const d3 = require("d3");

export default class Map {
  constructor() {
    let map = d3.select("#map");
    let width = map.node().getBoundingClientRect().width;
    let height = width / 2;

    this.svg = map
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g");

    let path = d3.geoPath().projection(
      d3
        .geoEqualEarth()
        .scale(width / 7)
        .translate([width / 2, height / 2])
    );

    this.svg
      .selectAll("path")
      .data(topojson.feature(topo, topo.objects.countries).features)
      .enter()
      .append("path")
      .attr("d", path);
  }

  render(data, color) {
    this.svg
      .selectAll("path")
      .filter(d => d.properties.name === data)
      .style("fill", color);
  }
}
