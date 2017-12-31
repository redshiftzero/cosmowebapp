function parse_camb(data) {
  // Read in CAMB data files and return two clean arrays k/h, P(k)
  var lines = data.split('\n');
  var d = [];
  for (i = 1; i < lines.length - 1; i++) {
    var line = lines[i].split('    ');
    d.push({
      'k_over_h': line[1],
      'matter_power': line[2]
    });
  }
  return d;
}

function chart() {
  var svg = d3.select("svg"),
      margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear()
      .rangeRound([0, width]);

  var y = d3.scaleLog()
      .rangeRound([height, 0]);

  var line = d3.line()
      .x(function(d) { return x(d.k_over_h); })
      .y(function(d) { return y(d.matter_power); });

  d3.text("data/test_matterpower.dat", function(data) {
    d = parse_camb(data);
    console.log(d[0].k_over_h);
    console.log(d[0].matter_power);

    x.domain(d3.extent(d, function(d) { return d.k_over_h; }));
    y.domain(d3.extent(d, function(d) { return d.matter_power; }));

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
      .append("text")
        .attr("fill", "#000")
        .attr("x", 870)
        .attr("y", -4)
        .attr("dx", "0.71em")
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .text("k");

    g.append("g")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("font-size", "15px")
        .attr("text-anchor", "end")
        .text("P(k)");

    g.append("path")
        .datum(d)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
  });
};
