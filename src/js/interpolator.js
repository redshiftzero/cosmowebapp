var margin = {top: 20, right: 20, bottom: 30, left: 25};

//Interpolate P(k) table and plot
function run_pk_interpolation(){
  var k_range = [0.00005, 5.0];
  var pk_range = [50.0, 100000.0];
    g = plot_axes(margin, "#pk", "k [Mpc/h]", k_range, "P(k) [(Mpc/h)\u00B3]", pk_range, "Matter Power Spectrum");

  var pk_interp = interpolate(paramValue, param_table_pk, pk_table);

  //create new array with k and P(k) for plotting
  var pk_to_plot = [];
  for (var i = 0; i < pk_interp.length - 1; i++){
    pk_to_plot.push([pk_table[i][0], pk_interp[i]]);
  }

  plot_spectrum(pk_to_plot, g, margin, k_range, pk_range);
}

function run_cl_interpolation(){
  var l_range = [1, 5000];
  var cl_range = [50, 10000.0];
  g = plot_axes(margin, "#cl", "\u2113 (multipole)", l_range, "\u2113(\u2113+1)C(\u2113)/2\u03C0", cl_range, "CMB Angular Power Spectrum");

  var cl_interp = interpolate(paramValue, param_table_cl, cl_table);

  var cl_to_plot = [];
  // First two values of data are funky so we start at i=2
  for (var i = 2; i < cl_interp.length - 1; i++){
    cl_to_plot.push([cl_table[i][0], cl_interp[i]]);
  }

  plot_spectrum(cl_to_plot, g, margin, l_range, cl_range);
}

//Given text data read in from d3.text, process into
//P(k) tables and then call interpolation function
function process_pk_table(error, textData){
  if (error) return console.log(error);

  console.log("setting up pk table");

  pk_table = parse_table(textData);
  param_table_pk = parse_param(textData);
  s8_table_pk = parse_s8(textData);

  run_pk_interpolation();
}

function process_cl_table(error, textData){
  if (error) return console.log(error);

  console.log("setting up cl table");

  cl_table = parse_table(textData);
  param_table_cl = parse_param(textData);
  s8_table_cl = parse_s8(textData);

  run_cl_interpolation();
}

//Load data and run plotting
function run_display(){
  console.log("Preparing for ", paramName);
  if (paramName == 'Om' && !fix_omegamh2){
  	pk_filename = 'data/pk_modeltype_fiducial_param_om.txt';
    cl_filename = 'data/cl_modeltype_fiducial_param_om.txt';
  }
  if (paramName == 'Om' && fix_omegamh2){
  	pk_filename = 'data/pk_modeltype_fixomch2_param_om.txt';
    cl_filename = 'data/cl_modeltype_fixomch2_param_om.txt';
  }
  if (paramName == 'Omh2' && !fix_omegamh2){
  	pk_filename = 'data/pk_modeltype_fiducial_param_omch2.txt';
    cl_filename = 'data/cl_modeltype_fiducial_param_omch2.txt';
  }
  if (paramName == 'Obh2'){
      pk_filename = 'data/pk_modeltype_fiducial_param_obh2.txt';
      cl_filename = 'data/cl_modeltype_fiducial_param_obh2.txt';
  }
  if (paramName == 'tau'){
      pk_filename = 'data/pk_modeltype_fiducial_param_tau.txt';
      cl_filename = 'data/cl_modeltype_fiducial_param_tau.txt';
  }

  var q1 = d3.queue();
  q1.defer(d3.text, pk_filename);
  q1.await(process_pk_table);

  var q2 = d3.queue();
  q2.defer(d3.text, cl_filename);
  q2.await(process_cl_table);
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
