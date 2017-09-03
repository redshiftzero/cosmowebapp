function interpolate(param, param_table, func_table) {
    //param is desired value of parameter (i.e. Omega_M, n_s, Om h^2)
    //param_table is table of param values for which we've precomputed function
    //func_table is matrix of function evals (either P(k) or C(ell)
    //   dimension is (len(param_table), len(P(k)))

    //Determine indices that bound input value
    index1 = 0
    index2 = 1
    for (i = 0; i < param_table.length; i++){
	if ((i > 1) && (param_table[i] > param)){
	    index1 = param_table[i-1];
	    index2 = param_table[i];
	}
    }
    if ((param_table[index1] =< param) && (param_table[index2] >= param)){
	//success
    }
    else{
	//error!
    }

    //Determine weights for function at index1 and index2
    //double check this
    weight1 = (param_table[index2]-param)/(param_table[index2] - param_table[index1]);
    weight2 = (param - param_table[index1])/(param_table[index2] - param_table[index1]);

    //Generate output array
    //is this the right way to do this?
    output_array = [];
    for (i = 0; i < func_table[0].length; i++){
	new_val = weight1*func_table[index1,i] + weight2*func_table[index2,i];
	output_array.push(new_val);
    }

    return output_array;
    
};

//Interpolate for plotting
function interpolate1d(){

}
