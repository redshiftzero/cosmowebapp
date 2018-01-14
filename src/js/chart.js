//Plot axes
function plot_pk_axes(margin){
    d3.select("#pk").selectAll("*").remove();
    var svg = d3.select("#pk"),
	margin = margin,
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    g.attr("width",width);
    g.attr("height",height);


    var x = d3.scaleLog().range([margin.left, width - margin.right]).domain([0.00005, 10.0]);

    var y = d3.scaleLog().range([height - margin.top, margin.bottom]).domain([10.0, 1000000.0]);


    var xAxis = d3.axisBottom()
      .scale(x);

    var yAxis = d3.axisLeft()
	.scale(y);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("fill", "#000")
        .attr("x", 870)
        .attr("y", -4)
        .attr("dx", "0.71em")
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .text("k");

    g.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis)
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("font-size", "15px")
        .attr("text-anchor", "end")
        .text("P(k)");
    return g
}

function plot_cl_axes(margin){
    d3.select("#cl").selectAll("*").remove();
    var svg = d3.select("#cl"),
	margin = margin,
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    g.attr("width",width);
    g.attr("height",height);

      // x: angular scale
      var x = d3.scaleLog().range([margin.left, width-margin.right]).domain([1, 5000]);

      // y: CMB power
      var y = d3.scaleLog().range([height-margin.bottom, margin.top]).domain([1, 10000.0]);

    var xAxis = d3.axisBottom()
      .scale(x);

    var yAxis = d3.axisLeft()
	.scale(y);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("fill", "#000")
        .attr("x", 870)
        .attr("y", -4)
        .attr("dx", "0.71em")
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .text("l");

    g.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis)
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("font-size", "15px")
        .attr("text-anchor", "end")
        .text("C(l)");
    return g
}

//Plot power spectrum given data and svg "g"
function plot_pk(data, g, margin) {
    var width = g.attr("width");
    var height = g.attr("height");

  var x = d3.scaleLog().range([margin.left, width-margin.right]).domain([0.00005, 10.0]);

  var y = d3.scaleLog().range([height-margin.bottom, margin.top]).domain([10.0, 100000.0]);

  var line = d3.line()
      .x(function(d,i) { return x(data[i][0]); })
      .y(function(d,i) { return y(data[i][1]); });
//      .x(function(d,i) { return x(data[i]["k_over_h"]); })
//      .y(function(d,i) { return y(data[i]["matter_power"]); });

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
}

// Plot CMB angular power spectrum
function plot_cl(data, g, margin) {
  var width = g.attr("width");
  var height = g.attr("height");

  // x: angular scale
  var x = d3.scaleLog().range([margin.left, width-margin.right]).domain([1, 5000]);

  // y: CMB power
  var y = d3.scaleLog().range([height-margin.bottom, margin.top]).domain([1, 100000.0]);

  var line = d3.line()
      .x(function(d,i) { return x(data[i][0]); })
      .y(function(d,i) { return y(data[i][1]); });

  // First two values cause trouble so shift them into the void
  var remove = data.shift();
  var remove = data.shift();

  console.log(data);

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
}
