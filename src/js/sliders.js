var olam_slider = document.getElementById("omega-lambda-slider");
var olam_sliderValue = document.getElementById("omega-lambda-range-value");

var om_slider = document.getElementById("omega-m-slider");
var om_sliderValue = document.getElementById("omega-m-range-value");

var omh2_slider = document.getElementById("omega-mh2-slider");
var omh2_sliderValue = document.getElementById("omega-mh2-range-value");

var h_slider = document.getElementById("h-slider");
var h_sliderValue = document.getElementById("h-range-value");

function set_defaults(){
    //These should match what was used to generate P(k) and C(l)
    var default_olam = 0.75102;
    var default_om = 0.2489;
    var default_omh2 = 0.122;
    var default_h = 0.7;

    olam_slider.value = default_olam;
    olam_sliderValue.innerHTML = parseFloat(default_olam).toFixed(2);

    om_slider.value = default_om;
    om_sliderValue.innerHTML = parseFloat(default_om).toFixed(2);

    omh2_slider.value = default_omh2;
    omh2_sliderValue.innerHTML = parseFloat(default_omh2).toFixed(2);

    h_slider.value = default_h;
    h_sliderValue.innerHTML = parseFloat(default_h).toFixed(2);

}

//Since we assume flatness treat Omega_lambda just as Omega_m
olam_slider.oninput = function() {
    var oldParam = paramName;
    var currentValue = this.value;
    var om = 1.0-currentValue;
    paramValue = om;
    paramName = "Om";

    //Set everything to defaults
    set_defaults();

    //Set Omega_lam slider values
    olam_slider.value = currentValue;
    olam_sliderValue.innerHTML = parseFloat(currentValue).toFixed(2);

    //Set Omega_m to desired value
    om_slider.value = om;
    om_sliderValue.innerHTML = parseFloat(om).toFixed(2);


    if (fix_omegamh2){
	var omh2 = omh2_slider.value;
	var newh = Math.sqrt(omh2/paramValue);
	h_slider.value = newh;
	h_sliderValue.innerHTML = parseFloat(newh).toFixed(2);
    }

    if (!fix_omegamh2){
	var h = h_slider.value;
	var new_omh2 = paramValue*h*h;
	omh2_slider.value = new_omh2;
	omh2_sliderValue.innerHTML = parseFloat(new_omh2).toFixed(2);
    }

    //If we're using the same parameter, don't need to reload data
    if (oldParam == paramName){
	run_pk_interpolation();
  run_cl_interpolation();
    }
    //Otherwise reload data
    if (oldParam != paramName){
	run_pk_display();
  run_cl_display();
    }
}


om_slider.oninput = function() {
    var oldParam = paramName;
    var currentValue = this.value;
    om_sliderValue.innerHTML = parseFloat(currentValue).toFixed(2);
    paramValue = currentValue;
    paramName = "Om";

    //Set everything to defaults
    set_defaults();

    //Set Omega_m to desired value
    om_slider.value = paramValue;
    om_sliderValue.innerHTML = parseFloat(paramValue).toFixed(2);

    //Change the value of Omega_lambda since we assume flatness
    var new_olam = 1.0-paramValue;
    olam_slider.value = new_olam;
    olam_sliderValue.innerHTML = parseFloat(new_olam).toFixed(2);

    if (fix_omegamh2){
	var omh2 = omh2_slider.value;
	var newh = Math.sqrt(omh2/paramValue);
	h_slider.value = newh;
	h_sliderValue.innerHTML = parseFloat(newh).toFixed(2);
    }

    if (!fix_omegamh2){
	var h = h_slider.value;
	var new_omh2 = paramValue*h*h;
	omh2_slider.value = new_omh2;
	omh2_sliderValue.innerHTML = parseFloat(new_omh2).toFixed(2);
    }

    //If we're using the same parameter, don't need to reload data
    if (oldParam == paramName){
	run_pk_interpolation();
  run_cl_interpolation();
    }
    //Otherwise reload data
    if (oldParam != paramName){
	run_pk_display();
  run_cl_display();
    }
}

omh2_slider.oninput = function() {
    var oldParam = paramName;
    var currentValue = this.value;

    paramValue = currentValue;
    paramName = "Omh2";
    //Set everything to defaults
    set_defaults();

    if (!fix_omegamh2){
	//Set Omega_mh2 to desired value
	omh2_slider.value = paramValue;
	omh2_sliderValue.innerHTML = parseFloat(paramValue).toFixed(2);

	var om = om_slider.value;
	var newh = Math.sqrt(paramValue/om);
	h_slider.value = newh;
	h_sliderValue.innerHTML = parseFloat(newh).toFixed(2);

	//If we're using the same parameter, don't need to reload data
	if (oldParam == paramName){
	    run_pk_interpolation();
      run_cl_interpolation();
	}
	//Otherwise reload data
	if (oldParam != paramName){
	    run_pk_display();
      run_cl_display();
	}
    }
}

h_slider.oninput = function() {
    var oldParam = paramName;
    var currentValue = this.value;
    h_sliderValue.innerHTML = parseFloat(currentValue).toFixed(2);
    paramValue = currentValue;
    paramName = "h";
    //Set everything to defaults
    set_defaults();
    //Set this slider to desired value
    h_slider.value = paramValue;
    h_sliderValue.innerHTML = parseFloat(paramValue).toFixed(2);

    if (!fix_omegamh2){
	var om = om_slider.value;
	var new_omh2 = om*paramValue*paramValue;
	omh2_slider.value = new_omh2;
	omh2_sliderValue.innerHTML = parseFloat(new_omh2).toFixed(2);
    }
    if (fix_omegamh2){
	var omh2 = omh2_slider.value;
	var new_om = omh2/(paramValue*paramValue);
	om_slider.value = new_om;
	om_sliderValue.innerHTML = parseFloat(new_om).toFixed(2);
    }

    //If we're using the same parameter, don't need to reload data
    if (oldParam == paramName){
	run_pk_interpolation();
  run_cl_interpolation();
    }
    //Otherwise reload data
    if (oldParam != paramName){
	run_pk_display();
  run_cl_display();
    }
}
