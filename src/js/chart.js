function parse_camb_tsv(data) {
  // Read in CAMB data files and return two clean arrays k/h, P(k)
  var d = [];
  for (var i = 1; i < data.length; i++) {
      d.push({
      'k_over_h': data[i].kh,
      'matter_power': data[i].Pk
      });
  }
  return d;
}

function parse_camb(data){
  // Read in CAMB data files and return array of k and P(k)
  var lines = data.split('\n');
  var d = [];
  for (i = 1; i < lines.length - 1; i++) {
    var line = lines[i].split('    ');
    d.push(
      [line[1],line[2]]
    );
  }
  return d;
}

function parse_camb_k(data){
  // Read in CAMB data files and return array of P(k)
  var lines = data.split('\n');
  var d = [];
  for (i = 1; i < lines.length - 1; i++) {
    var line = lines[i].split('    ');
    d.push(
	line[1]
    );
  }
  return d;
}

function parse_camb_pk(data){
  // Read in CAMB data files and return array of P(k)
  var lines = data.split('\n');
  var d = [];
  for (i = 1; i < lines.length - 1; i++) {
    var line = lines[i].split('    ');
    d.push(
      line[2]
    );
  }
  return d;
}

function chart(){
    var margin = {top: 20, right: 20, bottom: 30, left: 50};
    d3.text("data/test_matterpower.dat", function(data) {
	d = parse_camb(data);
	g = plot_axes(margin);
	plot_pk(d, g, margin);
  });
    
}

//Plot axes
function plot_axes(margin){
    var svg = d3.select("svg"),
	margin = margin,
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    g.attr("width",width);
    g.attr("height",height);
    

    var x = d3.scaleLog().range([margin.left, width - margin.right]).domain([0.00005, 10.0]);

    var y = d3.scaleLog().range([height - margin.top, margin.bottom]).domain([10.0, 100000.0]);


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
