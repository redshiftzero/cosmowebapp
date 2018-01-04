
function run_interpolation(){
    console.log("rinnnnnn");
    var margin = {top: 20, right: 20, bottom: 30, left: 50};

    //Needed to get k array
    pk1 = get_k_pk_from_table(pk_table, 0)

    //Set up plot axes
    g = plot_axes(margin);

    //Get desired value from slider
    var omh2_desired = paramValue;
    var omh2_table = [0.005,0.3];
    var newpk = interpolate(omh2_desired, omh2_table, pk_table) ;
    //create new array with k and P(k) for plotting
    var pk3 = [];
    for (var i = 0; i < newpk.length; i++){
	pk3.push([pk1[i][0], newpk[i]]);
    }
   
    plot_pk(pk3, g, margin);
}


function test_interpolator(){
    var margin = {top: 20, right: 20, bottom: 30, left: 50};

    pk1 = get_k_pk_from_table(pk_table, 0)
    pk2 = get_k_pk_from_table(pk_table, 1)

    g = plot_axes(margin);

    plot_pk(pk1, g, margin);
    plot_pk(pk2, g, margin);

    //Interpolate between these two P(k)
    var omh2_desired = 0.1;
    console.log("omh2_desred = ", omh2_desired);
    var omh2_table = [0.005,0.3];
    var newpk = interpolate(omh2_desired, omh2_table, pk_table) ;
    //create new array with k and P(k) for plotting
    var pk3 = [];
    for (var i = 0; i < newpk.length; i++){
	pk3.push([pk1[i][0], newpk[i]]);
    }
   
    plot_pk(pk3, g, margin);
}

function old_interpolator_test(){
   var margin = {top: 20, right: 20, bottom: 30, left: 50};
   d3.text("data/test_matterpower.dat", function(data1) {
    pk1 = parse_camb(data1);
    d3.text("data/omega_m_h2_005_matterpower.dat", function(data2) {
	pk2 = parse_camb(data2);
	g = plot_axes(margin);
	plot_pk(pk1, g, margin);
	plot_pk(pk2, g, margin);
    });
  });
}

function process_pk_table(error, textData){
    if (error) return console.log(error);

    var camb_data;
    for (var i = 0; i < textData.length; i++){
	var k_array = [];
	var pk_array = [];
	camb_data = parse_camb(textData[i]);
	//Get P(k)
	for (var pi = 0; pi < camb_data.length; pi++){
	    pk_array.push(camb_data[pi][1]);
	}
	//Make k the first column
	if (i == 0){
	    for (var ki = 0; ki < camb_data.length; ki++){
		k_array.push(camb_data[ki][0]);
	    }
	    pk_table.push(k_array);
	}
	// Add this data to table
	//pk_table[0][i] = k
	//pk_table[1...][i] = P(k)
	pk_table.push(pk_array);
    }
    //test_interpolator();
    run_interpolation();
}

function test_full(){
    var filename_list = ["data/test_matterpower.dat", "data/omega_m_h2_005_matterpower.dat"];

    var q = d3.queue();
    for (var fi = 0; fi < filename_list.length; fi++){
	q.defer(d3.text, filename_list[fi]);
    }
    q.awaitAll(process_pk_table);
}

function get_k_pk_from_table(pk_table, index){
    //Given a P(k) table, get k and Pk array for a particular index
    var d = [];
    for (i = 0; i < pk_table[0].length; i++){
	d.push(
	    [pk_table[0][i], pk_table[index+1][i]]
	);
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
    //   dimension is (1+len(param_table), len(P(k)))

    [lower_temp, upper_temp] = determine_bounding_indices(param, param_table);
    lowerindex = lower_temp;
    upperindex = upper_temp;
    
    //Determine weights for function at lowerindex and upperindex
    param_lower = param_table[lowerindex];
    param_upper = param_table[upperindex];
    [weight1, weight2] = compute_weights(param, param_lower, param_upper);

    //+1 since first column is either k or ell
    func_table_lower = func_table[lowerindex+1];
    func_table_upper = func_table[upperindex+1];
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
