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

function parse_pktable(data){
    // Read in CAMB data files and return array of k and P(k)
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
    console.log('parse_pktable')
    return d;
}

function parse_cltable(data){
    // Read in CAMB data files and return array of l and C(l)
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
    console.log('parse_cltable')
    console.log(d)
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
