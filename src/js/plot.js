function plot(data) {
  var svg = d3.select("svg"),
      margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var x = d3.scaleLog().range([margin.left, width - margin.right]).domain([0.001, 1.0]);

    var y = d3.scaleLog().range([height - margin.top, margin.bottom]).domain([1.0, 1000000.0]);


    var xAxis = d3.axisBottom()
    .scale(x);

   var yAxis = d3.axisLeft()
    .scale(y);

    
  var line = d3.line()
      .x(function(d,i) {
	  console.log('Plotting X ' + data[i][0]);
	  return x(data[i][0]);
		       })
      .y(function(d,i) {
	  console.log('Plotting Y ' + data[i][1]);
	  return y(data[i][1]);		       })

   
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line(data));


    svg.append("g") // Add the X Axis
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    svg.append("g") // Add the Y Axis
    .attr("class", "y axis")
    .call(yAxis);
};
