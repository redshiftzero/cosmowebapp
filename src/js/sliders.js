var slider = document.getElementById("omega-m-slider");
var sliderValue = document.getElementById("omega-m-range-value");

slider.oninput = function() {
  var currentValue = this.value;
  sliderValue.innerHTML = parseFloat(currentValue).toFixed(2);
  //console.log('here we will eventually compute interpolatation and update plot for ' + currentValue);
    paramValue = currentValue;
    run_interpolation();
}
