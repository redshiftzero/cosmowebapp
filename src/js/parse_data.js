function parse_param(data){
    // Read in CAMB data files and return array of parameters
    var lines = data.split('\n');
    var param_line = lines[5].split(' ');
    var d = [];
    for (i = 1; i < param_line.length; i++){
    	d.push(parseFloat(param_line[i]));
    }
    return d;
}

function parse_s8(data){
    // Read in CAMB data files and return sigma8
    var lines = data.split('\n');
    var s8_line = lines[6].split(' ');
    var d = [];
    for (i = 1; i < s8_line.length; i++){
	d.push(parseFloat(s8_line[i]));
    }
    return d;
}

function parse_table(data){
  // Read in CAMB data files and return array of scale and power
  var lines = data.split('\n');
  var d = [];
  //Need the -1 here?
  for (i = 7; i < lines.length; i++) {
    var line = lines[i].split(' ');
    var e = [];
    for (j = 0; j < line.length; j++){
      e.push(parseFloat(line[j]));
    }
    //d.push(line);
    d.push(e);
  }
  return d;
}
