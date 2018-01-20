function plot_axes(margin, svg_id, xlabel, xrange, ylabel, yrange, title){
  d3.select(svg_id).selectAll("*").remove();
  var svg = d3.select(svg_id);
	width = +svg.attr("width") - margin.left - margin.right;
	height = +svg.attr("height") - margin.top - margin.bottom;
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  g.attr("width",width);
  g.attr("height",height);
  console.log('width', width);
  console.log('height', height);

  var x = d3.scaleLog().range([margin.left, width - margin.right]).domain(xrange);

  var y = d3.scaleLog().range([height - margin.top, margin.bottom]).domain(yrange);

  var xAxis = d3.axisBottom()
    .scale(x)
    .ticks(5, ".4f");

  var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(5, ".0f");

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("fill", "#000")
    .attr("y", -4)
    .attr("x", 400)
    .attr("dx", "0.71em")
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .text(xlabel);

  g.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(yAxis)
    .append("text")
    .attr("fill", "#000")
    .attr("y", 10)
    .attr("x", 10)
    .attr("dy", "0.71em")
    .attr("font-size", "12px")
    .attr("text-anchor", "end")
    .text(ylabel);

  g.append("text")
    .attr("x", (width / 2) + 100)
    .attr("y", 0 - (margin.top / 2) + 50)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text(title);
  return g
}

function plot_spectrum(data, g, margin, xrange, yrange) {
  var width = g.attr("width");
  var height = g.attr("height");

  var x = d3.scaleLog().range([margin.left, width-margin.right]).domain(xrange);

  var y = d3.scaleLog().range([height-margin.bottom, margin.top]).domain(yrange);

  var line = d3.line()
    .x(function(d,i) { return x(data[i][0]); })
    .y(function(d,i) { return y(data[i][1]); });

  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);
}
