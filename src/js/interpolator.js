var margin = {top: 20, right: 20, bottom: 30, left: 50};

//Interpolate P(k) table and plot
function run_interpolation(){
  //Set up plot axes
  g = plot_pk_axes(margin);
  h = plot_cl_axes(margin);

  //console.log("param table = ", param_table);

  var pk_interp = interpolate(paramValue, param_table, pk_table);
  var cl_interp = interpolate(paramValue, param_table, cl_table);

  //console.log("pk table = ", pk_table[0]);
  //console.log("pk interp 0 = ", pk_interp[0]);

  //create new array with k and P(k) for plotting
  var pk_to_plot = [];
  for (var i = 0; i < pk_interp.length; i++){
    //console.log("test = ", pk_initial[i][0]);
    //console.log("length = ", pk_interp.length);
    pk_to_plot.push([pk_table[i][0], pk_interp[i]]);
  }

  // Do the same for C(l)
  for (var i = 0; i < cl_interp.length; i++){
    cl_to_plot.push([cl_table[i][0], cl_interp[i]]);
  }

  // Now plot interpolated P(k) and C(l)
  plot_pk(pk_to_plot, g, margin);
  plot_cl(cl_to_plot, g, margin);
}

//Given text data read in from d3.text, process into
//P(k) tables and then call interpolation function
function process_pk_table(error, textData){
  if (error) return console.log(error);

  console.log("setting up pk table");

  pk_table = parse_pktable(textData);
  param_table = parse_param(textData);
  s8_table = parse_s8(textData);

  run_interpolation();
}

//Load data and run plotting
function run_pk_display(){
  console.log("Preparing for ", paramName);
  if (paramName == 'Om' && !fix_omegamh2){
  	filename = 'data/pk_modeltype_fiducial_param_om.txt';
  }
  if (paramName == 'Om' && fix_omegamh2){
  	filename = 'data/pk_modeltype_fixomch2_param_om.txt';
  }
  if (paramName == 'Omh2' && !fix_omegamh2){
  	filename = 'data/pk_modeltype_fiducial_param_omch2.txt';
  }
  console.log("filename = ", filename);

  var q = d3.queue();
  q.defer(d3.text, filename);
  console.log("filename = ", filename);

  q.await(process_pk_table);
}

function get_k_pk_from_table(pk_table, index){
  //Given a P(k) table, get k and Pk array for a particular index
  var d = [];
  for (i = 0; i < pk_table[0].length; i++) {
    d.push([pk_table[0][i], pk_table[index+1][i]]);
  }
  return d
}

function determine_bounding_indices(param, param_table) {
  lowerindex = 0;
  upperindex = 1;
  if (param < param_table[0]) {
    // Then the parameter in question is out of range (too small)
    return [null, null];
  }

  for (i = 1; i < param_table.length; i++){
    if (param_table[i] > param){
      // Then we are in the correct range
      lowerindex = i-1;
      upperindex = i;
      return [lowerindex, upperindex];
    }
  }

  // Then the parameter in question is out of range (too large)
  return [null, null];
}

function compute_weights(param, param_lower, param_upper) {
  weight1 = (param_upper - param)/(param_upper - param_lower);
  weight2 = (param - param_lower)/(param_upper - param_lower);
  return [weight1, weight2];
}

function interpolate_between_two_lines(weight1, weight2, func_table_lower, func_table_upper) {
  output_array = [];
  for (i = 0; i < func_table_upper.length; i++){
    new_val = weight1*func_table_lower[i] + weight2*func_table_upper[i];
    output_array.push(new_val);
  }
  return output_array;
}

function interpolate(param, param_table, func_table) {
  //param is desired value of parameter (i.e. Omega_M, n_s, Om h^2)
  //param_table is table of param values for which we've precomputed function
  //func_table is matrix of function evals (either P(k) or C(ell)
  //dimension is (1+len(param_table), len(P(k)))
  //first column is k

  [lower_temp, upper_temp] = determine_bounding_indices(param, param_table);
  lowerindex = lower_temp;
  upperindex = upper_temp;

  //Determine weights for function at lowerindex and upperindex
  param_lower = param_table[lowerindex];
  param_upper = param_table[upperindex];
  [weight1, weight2] = compute_weights(param, param_lower, param_upper);

  //+1 since first column is either k or ell
  //func_table_lower = func_table[lowerindex+1];
  //func_table_upper = func_table[upperindex+1];
  var func_table_lower = [];
  var func_table_upper = [];
  for (var i = 0; i < func_table.length; i++){
  	func_table_lower.push(func_table[i][lowerindex+1]);
  	func_table_upper.push(func_table[i][upperindex+1]);
  }

  output_array = interpolate_between_two_lines(weight1, weight2, func_table_lower, func_table_upper);
  return output_array;
};
