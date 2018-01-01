function test_interpolator(){
   var margin = {top: 20, right: 20, bottom: 30, left: 50};
   d3.tsv("data/test_matterpower.dat", function(data1) {
    d1 = parse_camb(data1);
    d3.tsv("data/omega_m_h2_005_matterpower.dat", function(data2) {
	d2 = parse_camb(data2);
	g = plot_axes(margin);
	plot_pk(d1, g, margin);
	plot_pk(d2, g, margin);
    });

  });
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
    //   dimension is (len(param_table), len(P(k)))

    [lowerindex, upperindex] = determine_bounding_indices(param, param_table);

    //Determine weights for function at lowerindex and upperindex
    param_lower = param_table[lowerindex];
    param_upper = param_table[upperindex];
    [weight1, weight2] = compute_weights(param, param_lower, param_upper);

    func_table_lower = func_table[lowerindex];
    func_table_upper = func_table[upperindex];
    output_array = interpolate_between_two_lines(weight1, weight2, func_table_lower, func_table_upper);
    return output_array;
};

//Interpolate 1D function, useful for plotting
function interpolate1d(x_out, x_in, y_in){
    lowerindex = 0;
    upperindex = 1;

    y_out = []
    for (i = 0; i < x_out.length; i++){
	x_desired = x_out[i];
	for (i = lowerindex; i < param_table.length; i++){
	    if ((i > 1) && (x_in[i] > x_desired)){
		lowerindex = param_table[i-1];
		upperindex = param_table[i];
		break;
	    }
	}

	weight1 = (x_in[upperindex]-x_desired)/(x_in[upperindex] - x_in[lowerindex]);
	weight2 = (x_desired - x_in[lowerindex])/(x_in[upperindex] - x_in[lowerindex]);
	y_out_i =  weight1*y_in[lowerindex,i] + weight2*y_in[upperindex,i];
	y_out.push(y_out_i);
    }

    return y_out;

}
