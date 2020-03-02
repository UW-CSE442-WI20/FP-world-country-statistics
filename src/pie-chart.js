const d3 = require("d3");

async function makeDonut(final_data) {
    let colors = ['#4e73df', '#f6c23e', '#36b9cc', '#1cc88a', '#6f42c1', '#5a5c69'];
    let data = [
        { color: '#4e73df', name: 'Electricity', value: "12"},
        { color: '#f6c23e', name: 'Solar', value: 123.4},
        { color: '#36b9cc', name: 'Gas', value: 312 },
        { color: '#1cc88a', name: 'Kerosene', value: 123.2}
    ];

    let text = '';

    let width = 160;
    let height = 160;
    let thickness = 20;
    let duration = 200;

    let radius = Math.min(width, height) / 2;

    let svg = d3.select('#pie')
        .append('svg')
        .attr('class', 'pie')
        .attr('width', width)
        .attr('height', height);

    let g = svg.append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    let arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius);

    let pie = d3.pie()
        .value(function (d) { return d.value; })
        .sort(null);

    let path = g.selectAll('path')
        .data(pie(data))
        .enter()
        .append('g')
        .on('mouseover', function (d) {
            let g = d3.select(this)
                .style('cursor', 'pointer')
                .style('fill', 'black')
                .append('g')
                .attr('class', 'text-group');

            g.append('text')
                .attr('class', 'name-text')
                .text(`${d.data.name}`)
                .attr('text-anchor', 'middle')
                .attr('dy', '-1.2em');

            g.append('text')
                .attr('class', 'value-text')
                .text(`${d.data.value}`)
                .attr('text-anchor', 'middle')
                .attr('dy', '.6em');
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .style('cursor', 'none')
                .style('fill', `${d.data.color}`)
                .select('.text-group').remove();
        })
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) { return d.data.color; })
        .on('mouseover', function (d) {
            d3.select(this)
                .style('cursor', 'pointer')
                .style('fill', 'black');
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .style('cursor', 'none')
                .style('fill', `${d.data.color}`);
        });

    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.20em')
        .text(text);
}

export default makeDonut;
