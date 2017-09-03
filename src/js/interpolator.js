function interpolate(param, param_table, func_table) {
    //param is desired value of parameter (i.e. Omega_M, n_s, Om h^2)
    //param_table is table of param values for which we've precomputed function
    //func_table is matrix of function evals (either P(k) or C(ell)
    //   dimension is (len(param_table), len(P(k)))

    //Determine indices that bound input value
    lowerindex = 0;
    upperindex = 1;
    for (i = 0; i < param_table.length; i++){
	if ((i > 1) && (param_table[i] > param)){
	    lowerindex = param_table[i-1];
	    upperindex = param_table[i];
	    break;
	}
    }
    if ((param_table[lowerindex] =< param) && (param_table[upperindex] >= param)){
	//success
    }
    else{
	//error!
    }

    //Determine weights for function at lowerindex and upperindex
    //double check this
    weight1 = (param_table[upperindex]-param)/(param_table[upperindex] - param_table[lowerindex]);
    weight2 = (param - param_table[lowerindex])/(param_table[upperindex] - param_table[lowerindex]);

    //Generate output array
    //is this the right way to do this?
    output_array = [];
    for (i = 0; i < func_table[0].length; i++){
	new_val = weight1*func_table[lowerindex,i] + weight2*func_table[upperindex,i];
	output_array.push(new_val);
    }

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
